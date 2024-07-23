let label = document.getElementById("label");
let cartPrice = document.getElementById("total-price");
let shoppingCart = document.getElementById("shopping-cart");

//virtual basket to save products
let basket = JSON.parse(localStorage.getItem("shopping-data")) || [];


let calculation =()=>{
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map( (x) => x.item).reduce((x,y)=>x+y,0)
    //console.log(basket.map( (x) => x.item).reduce((x,y)=>x+y,0));
};

calculation();


// displays the items in the cart 
let generateCartItems = () =>{
    //console.log(basket);
    if(basket.length !== 0){
        
        return (shoppingCart.innerHTML = basket
            .map((x)=>{
                console.log(x);
                let {id,item} = x;
                let search = shopItemsData.find((y)=>y.id === id)|| [];
            return `
            <div class="cart-item">
            <img width="100" src="${search.img}" alt="" />
            <dib class="details">
                <div class="title-price-x">
                    <h4 class="title-price">
                        <p>${search.name}</p>
                        <p>$ ${search.price}</p>
                    </h4>
                    <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                </div>

                <div class="buttons">
                    <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                    <div id=${id} class="quantity">${item}</div>
                    <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                </div>

                <h3 class="item-total">$ ${item * search.price}</h3> 
            </div>
            </div>
            `;
        })
        .join(""));
    } else{
        shoppingCart.innerHTML = ``;
        label.innerHTML = `
        <h2> Cart is Empty </h2>
        <a href="home">
            <button class="HomeBtn">Back to Home</button>
        </a>
        `;
    }
};

generateCartItems();

//increment item to cart
let increment = (id)=>{
    let selectedItem = id;
    let search = basket.find((x)=> x.id === selectedItem.id)
    //if item isnt in cart add it to cart and increment item to 1
    if(search === undefined){
    basket.push({
        id: selectedItem.id,
        item: 1,
    });
    //if item is in cart just increase the number without adding it again
    } else {
        search.item += 1;
    }
    
    generateCartItems();
    update(selectedItem.id);
    localStorage.setItem("shopping-data", JSON.stringify(basket));
};

//decrement item to cart
let decrement = (id)=>{
    let selectedItem = id;
    let search = basket.find((x)=> x.id === selectedItem.id) 

    if(search === undefined) return;
    else if(search.item === 0) return;
     else {
        search.item -= 1;
    };

    update(selectedItem.id);
    basket = basket.filter((x)=> x.item !== 0);
    generateCartItems();
    totalPrice();
    localStorage.setItem("shopping-data", JSON.stringify(basket));
};
// update the items in the cart and recalculate the total price
let update = (id)=>{
    let search = basket.find((x)=>x.id === id);
    //console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    totalPrice();
};

//removes item from cart
let removeItem =(id)=>{
    let selectedItem = id;
    //console.log(selectedItem.id);
    basket = basket.filter((x)=>x.id !== selectedItem.id);
    generateCartItems();
    calculation();
    totalPrice();
    
    localStorage.setItem("shopping-data", JSON.stringify(basket));
};


//shows the total price in the cart
let totalPrice = ()=>{
    if(basket.length !== 0){
        let amount = basket.map((x)=>{
            let {item, id} = x;
            let search = shopItemsData.find((y)=>y.id === id)|| [];
            
            return item * search.price;
        }).reduce((x,y)=>x+y,0);
       // console.log(amount)

       cartPrice.innerHTML = `
       <h2 class="totalBill">Total Bill: $ ${amount}</h2>
       <button class="checkout">Checkout</button>
       `;
    }else {
        cartPrice.innerHTML = ``;
    };

};

totalPrice();
