let shop = document.getElementById("shop");


//creates basket and stores it in the local storage
let basket = JSON.parse(localStorage.getItem("shopping-data")) || [];

//generate product page
let generateShop =()=> {
    return (shop.innerHTML= shopItemsData
        .map((x)=>{
            let {id,name,price, img} = x;
            let search= basket.find((x) => x.id  === id) || [];
        return `<div id=product-id-${id} class="box">
        <div class="images">
          <img src="${img}" />
          <div class="info">
            <h3 class="title">${name}</h3>
            <div class="subinfo">
              <div class="price">$ ${price}</div>
              <!--  plus miinus cart-->
              <div class="buttons">
                <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                <div id=${id} class="quantity">${search.item === undefined? 0: search.item}</div>
                <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>      
        `;
    })
    .join(""));
};

generateShop();
//increment button to increase the number next to the cart 
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
    
    //console.log(basket);
    update(selectedItem.id);
    localStorage.setItem("shopping-data", JSON.stringify(basket));
};
//decrement button to decrease the number next to the cart 
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
    //console.log(basket);
    localStorage.setItem("shopping-data", JSON.stringify(basket));
};
// recalculate the number next to the cart
let update = (id)=>{
    let search = basket.find((x)=>x.id === id);
    //console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation();
};

//calculate the number next to the cart icon
let calculation =()=>{
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map( (x) => x.item).reduce((x,y)=>x+y,0)
    //console.log(basket.map( (x) => x.item).reduce((x,y)=>x+y,0));
};

calculation();
