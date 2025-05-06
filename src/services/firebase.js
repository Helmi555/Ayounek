import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.db = app.firestore();
    this.auth = app.auth();
  }

  // AUTH ACTIONS ------------

  createAccount = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signInWithGoogle = () =>
    this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  signInWithFacebook = () =>
    this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  signInWithGithub = () =>
    this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

  signOut = () => this.auth.signOut();

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => this.db.collection("users").doc(id).set(user);

  getUser = (id) => this.db.collection("users").doc(id).get();

  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    return user.reauthenticateWithCredential(cred);
  };

  updateEmail = (currentPassword, newEmail) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              resolve("Email Successfully updated");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });


    countDocuments = async (collectionName) => {
      try {
        const snapshot = await this.db.collection(collectionName).get();
        return snapshot.size;
      } catch (error) {
        console.error(`Error counting documents in ${collectionName}:`, error);
        return 0; // Return 0 if there's an error
      }
    }

    getUsers = async () => {
      const snapshot = await this.db.collection('users').get();
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return {
        items: users,
        total: snapshot.size,
      };
    };
  // getUsers =async (lastRefKey, filters) => {
  //   let query = db.collection('users');

  //   if (lastRefKey) query = query.startAfter(lastRefKey);

  //   const snapshot = await query.limit(12).get();
  //   return {
  //     users: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
  //     lastKey: snapshot.docs[snapshot.docs.length - 1],
  //     total: await this.countDocuments('users')
  // }
  // }
  updateProfile = (id, updates) =>
    this.db.collection("users").doc(id).update(updates);

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });

  saveBasketItems = (items, userId) =>
    this.db.collection("users").doc(userId).update({ basket: items });

  setAuthPersistence = () =>
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);

  // PRODUCT ACTIONS --------------

  createOrder = (command) =>
    this.db.collection("commands").add(command);

  getOrders = (email) =>
    this.db.collection("commands").where("email", "==", email).get();

  getSingleProduct = (id) => this.db.collection("products").doc(id).get();

  getProducts = (lastRefKey, filters = {}) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let query = this.db.collection("products");

          if (filters.category && filters.category !== 0) {
            query = query.where("category", "==", filters.category);
          }

          query = query.orderBy(app.firestore.FieldPath.documentId());

          if (lastRefKey) {
            query = query.startAfter(lastRefKey);
          }

          query = query.limit(12);

          const snapshot = await query.get();

          const products = [];
          snapshot.forEach((doc) =>
            products.push({ id: doc.id, ...doc.data() })
          );
          const lastKey = snapshot.docs[snapshot.docs.length - 1];

          // Get total count for filtered products
          let totalQuery = await this.db.collection("products");
          if (filters.category && filters.category !== 0) {
            totalQuery = totalQuery.where("category", "==", filters.category);
          }
          const totalSnapshot = await totalQuery.get();
          const total = totalSnapshot.docs.length;

          resolve({ products, lastKey, total });
        } catch (e) {
          if (didTimeout) return;
          reject(e?.message || ":( Failed to fetch products.");
        }
      })();
    });
  };

  searchProducts = (searchKey) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        const productsRef = this.db.collection("products");

        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          const searchedNameRef = productsRef
            .orderBy("name_lower")
            .where("name_lower", ">=", searchKey)
            .where("name_lower", "<=", `${searchKey}\uf8ff`)
            .limit(12);
          const searchedKeywordsRef = productsRef
            .orderBy("dateAdded", "desc")
            .where("keywords", "array-contains-any", searchKey.split(" "))
            .limit(12);

          const nameSnaps = await searchedNameRef.get();
          const keywordsSnaps = await searchedKeywordsRef.get();

          clearTimeout(timeout);
          if (!didTimeout) {
            const searchedNameProducts = [];
            const searchedKeywordsProducts = [];
            let lastKey = null;

            if (!nameSnaps.empty) {
              nameSnaps.forEach((doc) => {
                searchedNameProducts.push({ id: doc.id, ...doc.data() });
              });
              lastKey = nameSnaps.docs[nameSnaps.docs.length - 1];
            }

            if (!keywordsSnaps.empty) {
              keywordsSnaps.forEach((doc) => {
                searchedKeywordsProducts.push({ id: doc.id, ...doc.data() });
              });
            }

            const mergedProducts = [
              ...searchedNameProducts,
              ...searchedKeywordsProducts,
            ];
            const hash = {};

            mergedProducts.forEach((product) => {
              hash[product.id] = product;
            });
            resolve({ products: Object.values(hash), lastKey });
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  getFeaturedProducts = (itemsCount = 12) =>
    this.db
      .collection("products")
      .where("isFeatured", "==", true)
      .limit(itemsCount)
      .get();

  getRecommendedProducts = (itemsCount = 12) =>
    this.db
      .collection("products")
      .where("isRecommended", "==", true)
      .limit(itemsCount)
      .get();

  addProduct = (id, product) =>
    this.db.collection("products").doc(id).set(product);

  generateKey = () => this.db.collection("products").doc().id;

  editProduct = (id, updates) =>
    this.db.collection("products").doc(id).update(updates);

  removeProduct = (id) => this.db.collection("products").doc(id).delete();

  // CHART DATA METHODS --------------------
  getTotalRevenue = async () => {
    const snapshot = await this.db.collection("commands").get();
    return snapshot.docs.reduce((total, doc) => {
      const data = doc.data();
      return total + (data.total || 0);
    }, 0);
  };
  
  getTotalOrders = async () => {
    const snapshot = await this.db.collection("commands").get();
    return snapshot.size;
  };
  
  getAverageOrderValue = async () => {
    const revenue = await this.getTotalRevenue();
    const orders = await this.getTotalOrders();
    return orders > 0 ? revenue / orders : 0;
  };

  getMostSoldProducts = async (limit = 5) => {
    try {
      const snapshot = await this.db.collection("commands").get();
      const productCount = {};
      const productData = {};
  
      
      const promises = [];
      snapshot.forEach(doc => {
        const order = doc.data();
        if (order.basket?.length) {
          order.basket.forEach(item => {
            if (item.id) {
              productCount[item.id] = (productCount[item.id] || 0) + (item.quantity || 1);
              if (!productData[item.id]) {
                promises.push(
                  this.getSingleProduct(item.id)
                  .then(productDoc => {
                    if (productDoc.exists) {
                      productData[item.id] = productDoc.data();
                    }
                  })
                );
              }
            }
          });
        }
      });
  
      await Promise.all(promises);
      
      
      return Object.keys(productCount)
        .map(id => ({
          id,
          name: productData[id]?.name || 'Unknown Product',
          unitsSold: productCount[id],
          revenue: productCount[id] * (productData[id]?.price || 0)
        }))
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching most sold products:", error);
      return [];
    }
  };
  
  
  getMostSoldColors = async (limit = 5) => {
    try {
      const snapshot = await this.db.collection("commands").get();
      const colorCount = {};
      const productPromises = [];
  
     
      snapshot.forEach(doc => {
        const order = doc.data();
        if (order.basket?.length) {
          order.basket.forEach(item => {
            if (item.id) {
              productPromises.push(this.getSingleProduct(item.id));
            }
          });
        }
      });
  
      
      const productSnapshots = await Promise.all(productPromises);
      
      
      productSnapshots.forEach(productDoc => {
        if (productDoc.exists) {
          const product = productDoc.data();
          const colors = product.availableColors || [];
          colors.forEach(color => {
            colorCount[color] = (colorCount[color] || 0) + 1;
          });
        }
      });
  
      return Object.entries(colorCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching most sold colors:", error);
      return [];
    }
  };
  
  
  getMonthlyRevenue = async (year = new Date().getFullYear()) => {
    try {
      const snapshot = await this.db.collection("commands").get();
      const monthlyRevenue = Array(12).fill(0);
  
      snapshot.forEach(doc => {
        const order = doc.data();
        let orderDate;
        
       
        if (order.date?.toDate) {
          orderDate = order.date.toDate();
        } else if (order.date) {
          orderDate = new Date(order.date);
        } else {
          return;
        }
  
        if (orderDate.getFullYear() === year) {
          const month = orderDate.getMonth();
          monthlyRevenue[month] += order.total || 0;
        }
      });
  
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
  
      return {
        labels: monthNames,
        series: [{
          name: 'Revenue',
          data: monthlyRevenue
        }]
      };
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      return {
        labels: [],
        series: [{ data: [] }]
      };
    }
  };
  
  
  getUserCount = async () => {
    try {
      const snapshot = await this.db.collection("users").get();
      return snapshot.size;
    } catch (error) {
      console.error("Error fetching user count:", error);
      return 0;
    }
  };
}
const firebaseInstance=new Firebase()
export default firebaseInstance;