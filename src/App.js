import { ImBin2 } from "react-icons/im";
import { FaEdit } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
function App() {
  let [dangerAlert, setDangerAlert] = useState(false);
  let [text, setText] = useState("");
  let [alert, setAlert] = useState("");
  let [isShow, setIsShow] = useState(false);
  let [edit, setEdit] = useState(false);
  let [index, setIndex] = useState("");
  let [list, setList] = useState([]);
  let refContainer = useRef(null);
  let handleSubmit = (e) => {
    e.preventDefault();
    let value = refContainer.current.value;
    if (value && edit) {
      setAlert("value changed");
      setDangerAlert(false);
    }
    if (value) {
      let juju = { value, id: new Date().getTime().toString() };
      setList([...list, juju]); // this compile all the values of list into an array
      setAlert("item added to the list");
      setDangerAlert(false);
      setIsShow(true);
      setText(""); //to remove the value from the input immediately we click on submit
    }
    if (!value) {
      setAlert("please enter value");
      setDangerAlert(true);
    }
  };
  // for edit-submittion form button
  let editBtn = () => {
    setEdit(false);
    if (text) {
      list[index] = { text, id: new Date().getTime().toString() };
      list.splice(index, 1);
    }
    setAlert("value changed");
  };
  // for the remove button
  let removeItem = (id) => {
    let newList = list.filter((item) => {
      return item.id !== id;
    });
    setList(newList);
    setDangerAlert(true);
    setAlert("item removed");
  };
  // for the edit button
  let editItem = (id) => {
    let newItem = list.filter((item) => {
      return item.id == id;
    });
    let indexNum = list.indexOf(newItem[0]);
    setIndex(indexNum);
    let test = newItem[0].value;
    setText(test);
    setEdit(true);
  };
  // for the clear button
  let clearItems = () => {
    setList([]);
    setDangerAlert(true);
    setAlert("empty list");
  };
  // To set timeout for the alerts
  useEffect(() => {
    let time = setTimeout(() => {
      setAlert();
    }, 2000);
    return () => {
      clearTimeout(time);
    };
  });
  // To store my list values in the local storage
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(list));
  }, [list]);
  // To get the items saved in the local storage
  const loadedLists = localStorage.getItem("lists")
    ? JSON.parse(localStorage.getItem("lists"))
    : [];
  // The values gotten from the local storage is passed inside useEffect to render it once the page loads and setIsShow is set true so the values of list will get displayed immediately our browser loads
  useEffect(() => {
    setList(loadedLists);
    setIsShow(true);
  }, []);
  return (
    <section>
      {alert && (
        <div className="alert-container">
          {dangerAlert ? (
            <div className="danger alert">{alert}</div>
          ) : !dangerAlert ? (
            <div className="success alert">{alert}</div>
          ) : null}
        </div>
      )}
      <h3 className="heading">grocery bud</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. eggs"
          ref={refContainer}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {edit ? (
          <button type="submit" className="btn" onClick={editBtn}>
            edit
          </button>
        ) : (
          <button type="submit" className="btn">
            submit
          </button>
        )}
      </form>
      {isShow &&
        list.map((item) => {
          let { value, id } = item;
          if (value) {
            return (
              <div key={id} className="grocery-lists">
                <div className="item-list">{value}</div>
                <div className="icons">
                  <FaEdit className="edit-icon" onClick={() => editItem(id)} />
                  <ImBin2
                    className="delete-icon"
                    onClick={() => removeItem(id)}
                  />
                </div>
              </div>
            );
          }
        })}
      {list.length >= 1 && (
        <button className="clear-items" onClick={clearItems}>
          clear items
        </button>
      )}
    </section>
  );
}

export default App;
