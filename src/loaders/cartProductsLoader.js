import axios, { Axios } from "axios";
import { getShoppingCart } from "../utilities/fakedb";
import { useState } from "react";

const cartProductsLoader = async () => {
    // const [products,setProducts]=useState([])
    const storedCart = getShoppingCart();
    const storedCartIds=Object.keys(storedCart)
    const loadedProducts = await fetch('http://localhost:5000/productByIds',{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(storedCartIds)
    });
    const products = await loadedProducts.json();


    // if cart data is in database, you have to use async await
   
console.log(storedCartIds)
    const savedCart = [];

    for (const id in storedCart) {
        const addedProduct = products?.find(pd => pd._id === id);
        if (addedProduct) {
            const quantity = storedCart[id];
            addedProduct.quantity = quantity;
            savedCart.push(addedProduct);
        }
    }

    // if you need to send two things
    // return [products, savedCart]
    // another options
    // return { products, cart: savedCart }

    return savedCart;
}

export default cartProductsLoader;