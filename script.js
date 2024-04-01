let cartItems = [];
let amountOfCartItems = [];

async function fetchAndDisplayProductCards() {
  const cardRow = document.getElementById('cardRow');

  for (let productId = 1; productId <= 20; productId++) {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      const product = await response.json();

      const cardColumn = document.createElement('div');
      cardColumn.classList.add('col-sm-6', 'col-md-5','col-lg-4', 'col-xl-3', 'mb-2');

      const card = document.createElement('div');
      card.classList.add('card', 'custom-card');

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const img = document.createElement('img');
      img.src = product.image;
      img.alt = product.title;
      img.classList.add('card-img-top');
      cardBody.appendChild(img);

      const cardText = document.createElement('p');
      cardText.classList.add('card-text', 'mt-auto');
      cardText.textContent = product.title;
      cardBody.appendChild(cardText);

      const price = document.createElement('p');
      price.textContent = product.price + "€";
      cardBody.appendChild(price);

      const buyButton = document.createElement('button');
      buyButton.textContent = 'Add to cart';
      cardBody.appendChild(buyButton);
      if (cartItems.includes(product)) {
        buyButton.disabled = true;
        buyButton.textContent = 'Added to cart'
      }
      buyButton.addEventListener('click', function() {
        cartItems.push(product);
        buyButton.disabled = true;
        buyButton.textContent = 'Added to cart'
    });
      card.appendChild(cardBody);

      cardColumn.appendChild(card);
      cardRow.appendChild(cardColumn);
    } catch (error) {
      console.error(`Error fetching product data for ID ${productId}:`, error);
    }
  }
}

window.onbeforeunload = function(){
  saveCartInLocalStorage();
};


function saveCartInLocalStorage() {
  if (amountOfCartItems.length == 0) {
    cartItems.forEach(element => {
      amountOfCartItems.push(1);
    });
  }
  localStorage.setItem('itemsInCart', JSON.stringify(cartItems))
  localStorage.setItem('amountInCart', JSON.stringify(amountOfCartItems))
}


async function displayCartItems() {
  let useTableActive = true;
  const table = document.getElementById("itemsInCartTable")
  cartItems = JSON.parse(localStorage.getItem('itemsInCart'));
  amountOfCartItems = JSON.parse(localStorage.getItem('amountInCart'));
  let count = 0;

  cartItems.forEach(element => {
    if(amountOfCartItems[count] != null) {
      const row = table.insertRow();

      if (useTableActive === true) {
        row.className = "table-active";
        useTableActive = false;
      }
      else {
        row.className = "table-primary"
        useTableActive = true;
      }
  
      const productName = row.insertCell(0);
      const individualPrice = row.insertCell(1)
      const productPrice = row.insertCell(2);
      const editItems = row.insertCell(3);
  
      productPrice.className = "productPrices alignTableRowToRight";
      editItems.className = "alignTableRowToRight editCell";
      individualPrice.className = "individualProductPrices alignTableRowToRight";
      
  
    
      const deleteButton = document.createElement("button");
      deleteButton.setAttribute("class", "buttonWithoutBorders deleteButtonClass");
      deleteButton.setAttribute("onclick", "deleteItem(this)");
      const deleteButtonIcon = document.createElement("span");
      deleteButtonIcon.setAttribute("class", "material-symbols-outlined");
      deleteButtonIcon.textContent = "delete";
      deleteButton.appendChild(deleteButtonIcon);
  
      const removeButton = document.createElement("button");
      removeButton.setAttribute("class", "buttonWithoutBorders");
      removeButton.setAttribute("onclick", "removeOneItem(this)");
      const removeButtonIcon = document.createElement("span");
      removeButtonIcon.setAttribute("class", "material-symbols-outlined");
      removeButtonIcon.textContent = "remove";
      removeButton.appendChild(removeButtonIcon);
  
      const showItemAmount = document.createElement("span");
      showItemAmount.setAttribute("class", "itemAmount");
      showItemAmount.textContent = amountOfCartItems[count]
      count++;
  
      const addButton = document.createElement("button");
      addButton.setAttribute("class", "buttonWithoutBorders");
      addButton.setAttribute("onclick", "addOneItem(this)");
      const addButtonIcon = document.createElement("span");
      addButtonIcon.setAttribute("class", "material-symbols-outlined");
      addButtonIcon.textContent = "add";
      addButton.appendChild(addButtonIcon);
  
      
      productName.innerHTML = element.title;
      productPrice.innerHTML = element.price;
      individualPrice.innerHTML = element.price;
      editItems.appendChild(deleteButton);
      editItems.appendChild(removeButton);
      editItems.appendChild(showItemAmount)
      editItems.appendChild(addButton);
    }
  });

  const totalRow = table.insertRow();
  totalRow.className = "table-dark";
  totalRow.setAttribute("id", "totalRowID");

  const totalLabel = totalRow.insertCell(0);
  const invisibleLabel = totalRow.insertCell(1)
  const totalSum = totalRow.insertCell(2);
  const purchase = totalRow.insertCell(3);

  purchase.setAttribute("class", "alignTableRowToRight")
  totalSum.setAttribute("id", "showTotalSum")
  totalSum.setAttribute("class", "alignTableRowToRight")
  const purchaseButton = document.createElement("button")
  purchaseButton.textContent = "Purchase"
  //purchaseButton.setAttribute("onclick", completePurchase);
  purchaseButton.setAttribute("type", "button");
  purchaseButton.setAttribute("class", "btn btn-outline-secondary purchaseButtonClass");
  purchaseButton.setAttribute("onclick", "completePurchase()");

  totalLabel.innerHTML = "Total:"
  totalSum.innerHTML = "#"
  purchase.appendChild(purchaseButton);


  /*const removeAllButton = document.createElement("button");
  removeAllButton.textContent = "Clear cart";
  removeAllButton.setAttribute("class", "btn btn-outline-secondary removeAllButtonClass");
  removeAllButton.setAttribute("onclick", "emptyCart()");*/


  updateTotalAmount();
} 

function deleteItem (button) {
  const row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
  

  updateTotalAmount()
}

function removeOneItem (button) {
  const cell = button.parentNode;
  const elements = cell.getElementsByClassName("itemAmount");
  const numberElement = parseInt(elements[0].innerHTML);

  if (numberElement === 1) {
    deleteItem(button)
  } else {
    const newValue = numberElement - 1;
    elements[0].innerHTML = newValue;
  }

  updateTotalAmount()
}

function addOneItem (button) {
  const cell = button.parentNode;
  const elements = cell.getElementsByClassName("itemAmount");
  const numberElement = parseInt(elements[0].innerHTML);

  const newValue = numberElement + 1;
  elements[0].innerHTML = newValue;

  updateTotalAmount()

}


function updateTotalAmount () {
  let totalSumOfItems = 0.0;
  const table = document.getElementById("itemsInCartTable");
  const arrayOfRows = table.querySelectorAll("tr");
  amountOfCartItems = [];

  arrayOfRows.forEach(row => {
    const editCellElement = row.querySelector(".editCell");

    if (editCellElement != undefined) {
    
      const priceElement = row.querySelector(".productPrices");
      const individualPrice = row.querySelector(".individualProductPrices").innerHTML;
      const amountOfItem = editCellElement.querySelector(".itemAmount").innerHTML;
      
      priceElement.innerHTML = (individualPrice * amountOfItem);
      totalSumOfItems = totalSumOfItems + (individualPrice * amountOfItem);

      amountOfCartItems.push(amountOfItem);
    }
    
  });

  arrayOfRows[arrayOfRows.length-1].querySelector("#showTotalSum").innerHTML = totalSumOfItems.toFixed(2);
  saveCartInLocalStorage();
}


function emptyCart() {
  const table = document.getElementById("itemsInCartTable");
  const arrayOfRows = table.querySelectorAll("tr");

  arrayOfRows.forEach(row => {
    const editCellElement = row.querySelector(".editCell");

    if (editCellElement != undefined) {
      const deleteButtonOfRow = editCellElement.querySelector(".deleteButtonClass");
      deleteItem(deleteButtonOfRow);
    }
    
  });
  cartItems = [];
  
}

function completePurchase() {
  if (cartItems.length == 0) {
    alert("You can't complete a purchase when your cart is empty. Please add items and try again.");
  }
  else {
    window.location.href = 'confirmation.html';
    localStorage.clear();
  }
}
