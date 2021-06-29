import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import classes from "./RenderCafe.module.css";
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function RenderCafe(props) {
  const [cafes, setCafes] = useState([]);

  const classesModal = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classesModal.paper}>
      <h2 id="simple-modal-title">Log in</h2>
      <p id="simple-modal-description">
        To find further information on cafe please login first
      </p>
    </div>
  );
  
  const cuisine = [
    {value:"Breakfast",label:"Breakfast"},
    {value:"Lunch",label:"Lunch"},
    {value:"Dinner",label:"Dinner"},
    {value:"Burger & Sandwich",label:"Burger & Sandwich"},
    {value:"Fast Food",label:"Fast Food"},
    {value:"Pizza",label:"Pizza"},
    {value:"BBQ, Kebab",label:"BBQ, Kebab"},
    {value:"Sushi",label:"Sushi"},
    {value:"Chicken Grill",label:"Chicken Grill"},
    {value:"Khash",label:"Khash"},
    {value:"Lahmajo",label:"Lahmajo"},
    {value:"Asian",label:"Asian"},
    {value:"Dessert", label:"Dessert"},
    {value:"Coffee and Tea",label:"Coffee and Tea"},
  ];

  const location = [
    {value:"Ajapnyak", label:"Ajapnyak"},
    {value:"Arabkir", label:"Arabkir"},
    {value:"Avan", label:"Avan"},
    {value:"Davtashen", label:"Davtashen"},
    {value:"Erebuni", label:"Erebuni"},
    {value:"Davtashen", label:"Davtashen"},
    {value:"Kanaker-Zeytun", label:"Kanaker-Zeytun"},
    {value:"Kentron", label:"Kentron"},
    {value:"Malatia-Sebastia", label:"Malatia-Sebastia"},
    {value:"Nork-Marash", label:"Nork-Marash"},
    {value:"Nubarashen", label:"Nubarashen"},
    {value:"Shengavit", label:"Shengavit"},
  ];

  const activity = [
    {value:"Work & Study", label:"Work & Study"},
    {value:"Friends Time", label:"Friends Time"},
    {value:"Music and Concerts", label:"Music and Concerts"},
    {value:"Hookah & Cigars", label:"Hookah & Cigars"},
    {value:"Friends Time", label:"Friends Time"},
    {value:"Friday Night", label:"Friday Night"},
    {value:"Wine & Cheese", label:"Wine & Cheese"},
    {value:"For Kids", label:"For Kids"},
  ];

  const [values, setValues] = useState({
    cuisine:"",
    district:"",
    tags:""
  });

  const token = localStorage.getItem("token");

  const handleChangeTwo = (e)=>{
    let result = e.map(a => a.value);
    if(result.length === 0) {
      result = "";
    }
    setValues({...values , tags:result}); 
    console.log(values, "cuisine change");
    }

    const handleChangeOne = (e)=>{
      let result = e.map(a => a.value);
      if(result.length === 0) {
        result = "";
      }
      setValues({...values , district:result}); 
      console.log(values, "disrict change");
      }

  const handleChange = (e)=>{
    let result = e.map(a => a.value);
    if(result.length === 0) {
      result = "";
    }
    setValues({...values , cuisine:result}); 
    console.log(values, "tags change");
    }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const {tags, cuisine, district } = values
 
    return  axios.post(`http://localhost:8050/cafes/filter?tags=${values.tags}`, { 
      cuisine,
      district,
      tags
    });
  };

let history = useHistory();
  async function fetchCafesFromServer() {
    const {tags, cuisine, district } = values
    const result = await axios.post("http://localhost:8050/cafes/filter", { 
      tags,
      cuisine, 
      district
    });
   setCafes(result.data);
  }

  useEffect(() => {
    fetchCafesFromServer();
  },[values]);

  const filteredCafes = cafes.filter((cafe) => {
    return cafe.name.toLowerCase().indexOf(props.search.toLowerCase()) !== -1;
  });

  return (
    <div className={classes.AllIn}>
       <div>
       <form className={classes.form} onSubmit={handleFormSubmit}>
       
        <h1>Filter by</h1>

        <div className={classes.sort}>
          <h3>Cuisine</h3>
          <Select options={cuisine} 
           isMulti
           onChange={handleChangeTwo}
           />
        </div>

        <div className={classes.sort}>
          <h3>District</h3>
          <Select options={location}
          isMulti 
           onChange={handleChangeOne}
           />
        </div>

        <div className={classes.sort}>
          <h3>Activity</h3>
          <Select options={activity} 
          isMulti
           onChange={handleChange}
           />
        </div>

          </form>
        </div>
    <div className={classes.renderCafe}>
     

    {filteredCafes.map((cafe) => (
      
      <div
        className={classes.eachCafe}
        onClick={() => {
          if(token){
          history.push("mycafe/" + cafe._id);
          }
          else {
            handleOpen();
          }
        }}
      >
      <Modal
        open={open}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>

        <img alt="cafeImage" src={cafe.selectedFile} style={{ width: "50%" }} />
        <p>
          <b>{cafe.name}</b> <br />
          Address: {cafe.street_name} <br />
          District: {cafe.district} <br />
          <div color="Green">{!!cafe.raitings? <div> <b>Rating: {cafe.raitings}</b> </div> : "No Raiting yet"}</div>
        </p>
      </div>
    ))}
  </div>

   
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import axios from "axios";
// import classes from "./RenderCafe.module.css";
// import Select from 'react-select';
// import Button from '@material-ui/core/Button';

// export default function RenderCafe(props) {
//   const [cafes, setCafes] = useState([]);


  
//   const cuisine = [
//     {value:"Dessert", label:"Dessert"},
//     {value:"ice cream",label:"ice cream"},
//     {value:"Coffee and Tea",label:"Coffee and Tea"},
//     {value:"Dinner",label:"Dinner"},
//     // "Burger & Sandwich",
//     // "Pizza",
//     // "BBQ, Kebab",
//     // "Sushi",
//     // "Chicken Grill",
//     // "Khash",
//     // "Lahmajo",
//     // "Breakfast",
//     // "Lunch",
//     // "Dinner",
//     // "Asian",
//   ];

//   const location = [
//     {value:"Ajapnyak", label:"Ajapnyak"},
//     {value:"Arabkir", label:"Arabkir"},
//     {value:"Center", label:"Center"}
//     // "Davtashen",
//     // "Erebuni",
//     // "Kanaker-Zeytun",
//     // "Kentron",
//     // "Malatia-Sebastia",
//     // "Nork-Marash",
//     // "Nor Nork",
//     // "Nubarashen",
//     // "Shengavit",
//   ];

//   const activity = [
//     {value:"Work & Study", label:"Work & Study"},
//     {value:"Friends Time", label:"Friends Time"},
//     {value:"Music and Concerts", label:"Music and Concerts"}
//     // "Hookah & Cigars",
//     // "Friday Night",
//     // "Wine & Cheese",
//     // "Beer House & Pub",
//     // "For Kids",
//   ];
//   const [values, setValues] = useState({
//     tags: "",
//     cuisine:"",
//     district:""

//   });

//   const handleChange = (e)=>{
//     let result = e.map(a => a.value)
//     setValues({...values , tags:result}); 
//    // console.log(values);
//     }
//   const handleChangeTwo = (e)=>{
//     let result = e.map(a => a.value)
//     console.log(result);
//     setValues({...values , cuisine:result}); 
//   //  console.log(values);

//     }

//   const handleChangeOne = (e)=>{
//     let result = e.map(a => a.value);
//     setValues({...values , district:result}); 
//     //console.log(values);
//     }

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     const {tags, cuisine, district } = values
//     console.log(values);

//     return  axios.post("http://localhost:8050/cafes/filter?tags=${values.tags}", { 
//       tags,
//       cuisine, 
//       district
//     });
//   };

// let history = useHistory();

//   async function fetchCafesFromServer() {
//    // const result = await axios.get("http://localhost:8050/cafes");
//      const {tags, cuisine, district } = values
//      console.log(values,"tags");
//     const result = await axios.post("http://localhost:8050/cafes/filter", { 
//       tags,
//       cuisine, 
//       district
//     });
//    setCafes(result.data);
//   }

//   useEffect(() => {
//     fetchCafesFromServer();

//   },[values]);

//   const filteredCafes = cafes.filter((cafe) => {
//     return cafe.name.toLowerCase().indexOf(props.search.toLowerCase()) !== -1;
//   });

//   return (
//     <div>
//        <div>
//        <form className={classes.form} onSubmit={handleFormSubmit}>
       
//         <h1>Sort by</h1>

//         <div className={classes.sort}>
//           <h3>Cuisine</h3>
//           <Select options={cuisine} 
//            isMulti
//            onChange={handleChangeTwo}
//            />
//         </div>

//         <div className={classes.sort}>
//           <h3>District</h3>
//           <Select options={location}
//           isMulti 
//            onChange={handleChangeOne}
//            />
//         </div>

//         <div className={classes.sort}>
//           <h3>Activity</h3>
//           <Select options={activity} 
//           isMulti
//            onChange={handleChange}
//            />
//         </div>

//         <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             className={classes.submit}
//           >
//             Show Applied
//           </Button>

//           </form>
//         </div>

//     <div className={classes.renderCafe}>
//       {filteredCafes.map((cafe) => (
//         <div
//           className={classes.eachCafe}
//           onClick={() => {
//             history.push("mycafe/" + cafe._id);
//           }}
//         >
//           <img alt="cafeImage" src={cafe.selectedFile} style={{ width: "50%" }} />
//           <p>
//             <b>{cafe.name}</b> <br />
//             Address: {cafe.street_name} <br />
//             District: {cafe.district} <br />
//           </p>
//         </div>
//       ))}
//     </div>
   
//     </div>
//   );
// }



