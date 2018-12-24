import React from 'react';
import FontAwesome from 'react-fontawesome';
import T from 'prop-types';

const Loader = ({ spin, size, icon }) => (
  <div className="loader-wrap">
    <FontAwesome
      name={icon || "rocket"}
      size={size || "2x"}
      spin={spin || false}
    />
  </div>
)

Loader.propTypes = {
  spin: T.bool,
  icon: T.string,
  size: T.string,
};

export default Loader;
