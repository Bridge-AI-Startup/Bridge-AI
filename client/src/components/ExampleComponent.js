import React from 'react';

function ExampleComponent({ title, children }) {
  return (
    <div className="example-component">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

export default ExampleComponent;
