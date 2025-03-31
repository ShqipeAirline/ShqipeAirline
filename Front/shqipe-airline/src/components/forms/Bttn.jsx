import React from 'react';

const Bttn = ({ label, onClick }) => {
  return (
    <button className={"formbttn"} onClick={onClick}>
      {label}
    </button>
  );
};

export default Bttn;
