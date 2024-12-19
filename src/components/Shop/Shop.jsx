import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    // const [cart, setCart] = useState([])
    const cart=useLoaderData()
    const [count,setCount]=useState(0)
    const [itemsPerPages,setItemsPerPages]=useState(10)
    const [currentPages,setCurrentPages]=useState(0)
    const storedCart = getShoppingCart();
    const storedCartIds=Object.keys(storedCart)

 
  const numberOfPages=Math.ceil(count/itemsPerPages)

// const pages=[]
//   for(let i=0; i<numberOfPages; i++){
// pages.push(i)
//   }
//   console.log(pages)

//   shortcut way crate data array
const pages=[...Array(numberOfPages).keys()]

useEffect(()=>{
    fetch('http://localhost:5000/productsCount')
    .then(res=>res.json())
    .then(data=>setCount(data.count))
},[])

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPages}&size=${itemsPerPages}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPages,itemsPerPages]);

    // useEffect(() => {
      
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleSelect=(e)=>{
        const value=parseInt(e.target.value)
       setItemsPerPages(value)
       setCurrentPages(0)
    }


    const handleButton=(page)=>{
setCurrentPages(page)
    }

    const handlePrev=()=>{
        if(currentPages>0){
            setCurrentPages(currentPages -1)
        }
    }

    const handleNext=()=>{
        if(currentPages< pages.length -1){
            setCurrentPages(currentPages + 1)
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <h1>current page: {currentPages}</h1>
                <button onClick={handlePrev}>pre</button>
                {
pages.map((page,idx)=><button 
className={currentPages === page ? 'selected': undefined}
onClick={()=>handleButton(page)} 
key={idx}>{page}</button>)
                }
                <button onClick={handleNext}>Next</button>
                 <select onChange={(e)=>handleSelect(e)} name="" id="">
                <option value="5">5</option>
                <option value="9">9</option>
                <option value="15">15</option>
                <option value="20">20</option>
            </select>
            </div>
           
        </div>
    );
};

export default Shop;