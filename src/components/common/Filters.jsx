/* eslint-disable no-nested-ternary */
import { useDidMount } from '@/hooks';
import PropType from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { applyFilter, resetFilter } from '@/redux/actions/filterActions';
import { selectMax, selectMin } from '@/selectors/selector';
import PriceRange from './PriceRange';

const categoryOptions = [
  { value: 0, label: 'All Categories', description: 'All available categories' },
  { value: 1, label: 'Rounded', description: 'Circular or oval frames' },
  { value: 2, label: 'Square', description: 'Frames with equal width and height, featuring sharp angles.' },
  { value: 3, label: 'Rectangle', description: 'Wider than they are tall, with straight lines and angles.' }
];

const Filters = ({ closeModal }) => {
  const { filter, isLoading, products } = useSelector((state) => ({
    filter: state.filter,
    isLoading: state.app.loading,
    products: state.products.items
  }));

  const [field, setFilter] = useState({
    brand: filter.brand || '',
    minPrice: filter.minPrice || 0,
    maxPrice: filter.maxPrice || 0,
    sortBy: filter.sortBy || '',
    category: Number(filter.category) || 0 // Ensure it's a number
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const didMount = useDidMount();

  const max = selectMax(products);
  const min = selectMin(products);

  useEffect(() => {
    if (didMount && window.screen.width <= 480) {
      history.push('/');
    }

    if (didMount && closeModal) closeModal();

    setFilter(filter);
    window.scrollTo(0, 0);
  }, [filter]);

  const onPriceChange = (minVal, maxVal) => {
    setFilter({ ...field, minPrice: minVal, maxPrice: maxVal });
  };

  const onBrandFilterChange = (e) => {
    const val = e.target.value;
    setFilter({ ...field, brand: val });
  };

  const onCategoryFilterChange = (e) => {
    const val = parseInt(e.target.value, 10); // Convert to number
    console.info("Selected Category:", val);
    setFilter({ ...field, category: val });
  };

  const onSortFilterChange = (e) => {
    setFilter({ ...field, sortBy: e.target.value });
  };

  const onApplyFilter = () => {
    if (field.minPrice > field.maxPrice) {
      alert('Minimum price cannot be greater than maximum price.');
      return;
    }

    const isChanged = Object.keys(field).some((key) => field[key] !== filter[key]);

    if (isChanged) {
      dispatch(applyFilter(field));
    } else {
      closeModal();
    }
  };

  const onResetFilter = () => {
    const initialFilter = {
      brand: '',
      minPrice: 0,
      maxPrice: 0,
      sortBy: '',
      category: 0
    };

    setFilter(initialFilter);
    dispatch(resetFilter());

    if (closeModal) closeModal();
  };

  return (
    <div className="filters">
      {/* BRAND FILTER */}
      <div className="filters-field">
        <span>Brand</span>
        <br />
        <br />
        {products.length === 0 && isLoading ? (
          <h5 className="text-subtle">Loading Filter</h5>
        ) : (
          <select
            className="filters-brand"
            value={field.brand}
            disabled={isLoading || products.length === 0}
            onChange={onBrandFilterChange}
          >
            <option value="">All Brands</option>
            <option value="salt">Salt Maalat</option>
            <option value="betsin">Betsin Maalat</option>
            <option value="black">Black Kibal</option>
            <option value="sexbomb">Sexbomb</option>
          </select>
        )}
      </div>

      {/* CATEGORY FILTER */}
      <div className="filters-field">
        <span>Category</span>
        <br />
        <br />
        <select
          className="filters-brand"
          value={field.category}
          disabled={isLoading || products.length === 0}
          onChange={onCategoryFilterChange}
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* SORT BY FILTER */}
      <div className="filters-field">
        <span>Sort By</span>
        <br />
        <br />
        <select
          className="filters-sort-by d-block"
          value={field.sortBy}
          disabled={isLoading || products.length === 0}
          onChange={onSortFilterChange}
        >
          <option value="">None</option>
          <option value="name-asc">Name Ascending A - Z</option>
          <option value="name-desc">Name Descending Z - A</option>
          <option value="price-desc">Price High - Low</option>
          <option value="price-asc">Price Low - High</option>
        </select>
      </div>

      {/* PRICE RANGE FILTER */}
      <div className="filters-field">
        <span>Price Range</span>
        <br />
        <br />
        {(products.length === 0 && isLoading) || max === 0 ? (
          <h5 className="text-subtle">Loading Filter</h5>
        ) : products.length === 1 ? (
          <h5 className="text-subtle">No Price Range</h5>
        ) : (
          <PriceRange
            min={min}
            max={max}
            initMin={field.minPrice}
            initMax={field.maxPrice}
            isLoading={isLoading}
            onPriceChange={onPriceChange}
            productsCount={products.length}
          />
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="filters-action">
        <button
          className="filters-button button button-small"
          disabled={isLoading || products.length === 0}
          onClick={onApplyFilter}
          type="button"
        >
          Apply filters
        </button>
        <button
          className="filters-button button button-border button-small"
          disabled={isLoading || products.length === 0}
          onClick={onResetFilter}
          type="button"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

Filters.propTypes = {
  closeModal: PropType.func.isRequired
};

export default withRouter(Filters);