import React from 'react'

export default function (props) {

    const handlebuy=()=>{
        props.setChannelId(props.channelId);
        props.setPostId(props.id)
        props.setChannel("buyer");
     
      }
  return (
    <div>
         <div class="desk-car-table-item1">
          <div class="desk-car-table-item1-child"></div>
          <div class="desk-cart-table-item-edits">
            <div onClick={handlebuy} class="desk-cart-buy-btn">
              <div class="desk-cart-buy-btn-child"></div>
              <div class="buy6">Buy</div>
            </div>
           
          </div>
          <img
            class="desk-cart-eth-icon"
            alt=""
            src="./public/desk-cart-eth.svg"
          />

          <b class="angry-graffiti11">{props.tittle}</b>
          <div class="the-dark-night9">{props.channelName}</div>
          <div class="live3">{props.status}</div>
          <div class="eth6">{props.price}</div>
        </div>
    </div>
  )
}
