import "./App.css";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [payer, setPayer] = useState("");
  const [points, setPoints] = useState("");
  const [addPointsDisplay, setAddPointsDisplay] = useState(false);
  const [spendPointsDisplay, setSpendPointsDisplay] = useState(false);
  const [data, setData] = useState([]);
  const [spendPoints, setSpendPoints] = useState("");

  const handleOnSubmitAddPoints = function (event) {
    const formData = new FormData();
    formData.append("payer", payer);
    formData.append("points", points);
    const requestOptions = {
      method: "POST",
      body: formData,
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    fetch("http://localhost:5001/add_points", requestOptions)
      .then((response) => response.text())
      .then((data) => setData(JSON.parse(data)));
  };

  const handleOnSubmitSpendPoints = function (event) {
    const formData = new FormData();
    formData.append("points", spendPoints);
    const requestOptions = {
      method: "POST",
      body: formData,
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    fetch("http://localhost:5001/spend_points", requestOptions)
      .then((response) => response.text())
      .then((data) => setData(JSON.parse(data)));
  };

  const handleOnSubmitReset = function (event) {
    const requestOptions = {
      method: "POST",
      body: "reset",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    fetch("http://localhost:5001/reset", requestOptions).then(() => {
      setData([]);
    });
  };

  return (
    <div className="App relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-600 bg-gradient-to-r">
      <div className={"text-5xl text-white pt-5 mx-auto"}>
        Fetch Rewards Backend Assessment
      </div>

      <div className={"relative grid grid-cols-2 mx-auto"}>
        <button
          onClick={() => {
            setAddPointsDisplay(true);
            setSpendPointsDisplay(false);
          }}
          className={
            "mx-auto text-3xl text-white mt-20 border-2 rounded-md w-48 py-2 px-2 "
          }
        >
          Add Transaction
        </button>

        <button
          onClick={() => {
            setSpendPointsDisplay(true);
            setAddPointsDisplay(false);
          }}
          className={
            "mx-auto text-3xl text-white mt-20 border-2 rounded-md w-48 py-2 px-2"
          }
        >
          Spend Points
        </button>
      </div>
      {addPointsDisplay ? (
        <div className={"relative mt-10"}>
          <div className={"mx-auto text-3xl text-white"}>
            Please enter the payer and the amount of points for the transaction
            you'd like to add:
          </div>
          <form name={"payer"} className={"relative grid grid-cols-2 text-2xl"}>
            <input
              className={"mx-auto rounded-md mt-5 pl-2"}
              placeholder={"Payer"}
              onChange={(event) => setPayer(event.target.value)}
            ></input>
            <input
              className={"mx-auto rounded-md mt-5 pl-2"}
              placeholder={"Points"}
              onChange={(event) => setPoints(event.target.value)}
            ></input>
          </form>
          <button
            onClick={() => {
              handleOnSubmitAddPoints();
              console.log("ADDING POINTS");
            }}
            className={"border-2 rounded-md px-2 py-2 text-2xl text-white mt-5"}
          >
            ADD
          </button>
        </div>
      ) : null}

      {spendPointsDisplay ? (
        <div className={"relative mt-10"}>
          <div className={"mx-auto text-3xl text-white"}>
            Please enter the amount of points you'd like to spend:
          </div>
          <form name={"spend"} className={"relative grid grid-cols-1 text-2xl"}>
            <input
              className={"mx-auto rounded-md mt-5 pl-2"}
              placeholder={"Points"}
              onChange={(event) => {
                setSpendPoints(event.target.value);
              }}
            ></input>
          </form>
          <button
            onClick={() => {
              handleOnSubmitSpendPoints();
              console.log("SPENDING POINTS");
            }}
            className={"border-2 rounded-md px-2 py-2 text-2xl text-white mt-5"}
          >
            SPEND
          </button>
        </div>
      ) : null}

      <div className="mx-auto items-center h-96 w-5/6 mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis tick={{ fill: "white" }} dataKey="payer" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="points" fill={"#38bdf8"} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={"mt-10 mx-auto"}>
        <button
          onClick={() => {
            setData([]);
            setPayer("");
            setPoints("");
            setAddPointsDisplay(false);
            setSpendPointsDisplay(false);
            handleOnSubmitReset();
          }}
          className={"text-3xl text-white px-2 border-2 rounded-md"}
        >
          RESET
        </button>

        <div className={"mt-10 mx-auto"}>
          <a
            href="http://localhost:5001/download"
            className={"text-3xl text-white px-2 border-2 rounded-md"}
          >
            Download Data
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
