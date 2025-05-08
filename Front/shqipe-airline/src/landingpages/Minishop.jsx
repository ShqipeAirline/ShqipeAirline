import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './Minishop.css'; 
import blackTShirtImage from './../images/blacklogotshirt.png';
import redTShirtImage from './../images/redlogotshirt.png';
import blackCapImage from './../images/logocap.png';
import albanMascotImage from './../images/mascot.png';
import laysOreganoImage from './../images/lays.png';
import cocaColaImage from './../images/coke.png';
import pringlesOriginalImage from './../images/pringles.png';
import waterImage from './../images/water.png';
import redJearsyImage  from './../images/nationaljearsyred.jpg';
import whiteJearsyImage  from './../images/nationaljearsywhite.jpg';
import blackJearsyImage from './../images/nationaljearsyblack.jpg';
import shqipeMugImage from './../images/shqipemug.png';


const products = [
    { name: 'Black T-Shirt', price: 20, image: blackTShirtImage },
    { name: 'Red T-Shirt', price: 20, image: redTShirtImage },
    { name: 'Black Cap', price: 15, image: blackCapImage },
    { name: 'Alban Mascot', price: 25, image: albanMascotImage },
    { name: "Lay's Oregano", price: 1.5, image: laysOreganoImage },
    { name: 'Coca-Cola', price: 2.5, image: cocaColaImage },
    { name: 'Pringles Original', price: 3.5, image: pringlesOriginalImage },
    { name: 'Water', price: 1, image: waterImage },
    { name: 'Red National Jearsy', price: 99, image: redJearsyImage },
    { name: 'White National Jearsy', price: 99, image: whiteJearsyImage },
    { name: 'Black National Jearsy', price: 99, image: blackJearsyImage },
    { name: 'Shqipe Mug', price: 10, image: shqipeMugImage }

];

const Minishop = () => {
    const navigate = useNavigate();  

    const handleAddToCart = () => {

        navigate('/shopping-cart');  
    };


    return (
        <div className='minishop'>

            <div className='products-grid'>
                {products.map((product, index) => (
                    <div className='product-card' key={index}>
                        <img src={product.image} alt={product.name} className='product-image' />
                        <h3 className='product-name'>{product.name}</h3>
                        <p className='product-price'>${product.price}</p>
                        <button className='add-to-cart-btn' onClick={handleAddToCart}>Add To Cart</button> {/* Add onClick */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Minishop;

