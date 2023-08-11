import React from 'react';

export default function PublisherCard(props) {
  const img = "./public/rectangle-6.svg"
 const handleClicked=()=>{
    props.setChannel("active");
    props.setId(props.id);
    console.log("clicked");
 }
  return (
    <div class="desk-home-publishers-card m-10" style={{top:props.top}}>
           
    <img
      class="desk-home-publishers-card-vect-icon"
      alt=""
      src="./public/desk-home-publishers-card-vector1.svg"
    />
    <div class="desk-home-publishers-card-main" >
              <img
                class="desk-home-publishers-card-main-child"
                alt=""
                src="./public/vector-6.svg"
              />

              <div style={{backgroundImage:img , paddingTop:"10px" }}  class="desk-home-publishers-card-stra">
              

                <b >Starting Price {props.price}ETH</b>
              </div>
              <div class="desk-home-publishers-card-desc">
                <b class="subconscious">{props.channelName}</b>
                <div class="you-become-a">
                  {props.decs}
                </div>
                <img
                  class="desk-home-publishers-card-etc-icon"
                  alt=""
                  src="./public/desk-home-publishers-card-etc-icon.svg"
                />
                { props.id !== "" &&(
                <div style={{cursor:"pointer" , zIndex:"100"}} onClick={handleClicked} class="desk-home-publishers-card-watc">
                  <div class="desk-home-publishers-card-watc-child"></div>
                  <b class="watch">Watch</b>
                </div>)}
              </div>
              <svg
  className="desk-home-publishers-card-main-item"
  width="1082"
  height="427"
  viewBox="0 0 1082 427"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <pattern
      id="image-pattern"
      patternUnits="userSpaceOnUse"
      width="100%"
      height="100%"
    >
      <image
        href= {props.img} // Replace with the URL of your image
        width="1082"
        height="427"
        preserveAspectRatio="xMidYMid slice"
      />
    </pattern>
  </defs>
  <path
    d="M11.1507 1.06605C45.5988 1.9568 53.4397 11.9557 53.5 37.0661L63.5 278.5C67.969 331.397 92.0594 339.496 151 338C151 338 876.267 348.403 973.5 345C1070.73 341.597 1080.45 421.725 1081 426C1081.55 430.275 1081 403.5 1081 382.066C1081 360.632 1081 37.0661 1081 37.0661C1078.27 12.6474 1069.99 5.46732 1046.5 1.06605H11.1507ZM11.1507 1.06605H0C3.99548 0.978985 7.7061 0.976985 11.1507 1.06605Z"
    stroke="black"
    fill="url(#image-pattern)" // Use the pattern here to fill with the image
    strokeWidth="0.1"
  />
</svg>



            </div></div>
  )
}
