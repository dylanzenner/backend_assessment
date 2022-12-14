from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from datetime import datetime
import csv
from io import StringIO


app = Flask(__name__)
CORS(
    app,
    resources={
        r"/add_points": {"origins": "*", "allow_headers": "*", "expose_headers": "*"},
        r"/spend_points": {"origins": "*", "allow_headers": "*", "expose_headers": "*"},
        r"/reset": {"origins": "*", "allow_headers": "*", "expose_headers": "*"},
    },
)

transactions = []
data = {}
now = datetime.now()


@app.route("/add_points", methods=["POST"])
def add_points():
    """
    Adds a transaction to the transactions list which will be utilized later in the spend_points route
    """
    global data, transactions
    return_data = []

    payer = request.form["payer"]
    points = int(request.form["points"])

    transactions.append(
        {
            "payer": payer,
            "points": points,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "spent": False,
        }
    )

    if payer not in data:
        data[payer] = points

    else:
        data[payer] += points
        if data[payer] == 0:
            del data[payer]

    for item in data:
        return_data.append({"payer": item, "points": data[item]})

    return return_data, 200


@app.route("/spend_points", methods=["POST"])
def spend_points():
    """
    Sorts the transactions by timestamp before spending the points which were passed in via the request
    """
    global data, transactions
    return_data = []

    transactions = sorted(transactions, key=lambda k: k["timestamp"])

    points_to_spend = int(request.form["points"])

    for transaction in transactions:

        if points_to_spend <= 0:
            break

        if transaction["points"] < 0 and transaction["spent"] != True:
            data[transaction["payer"]] -= transaction["points"]
            points_to_spend -= transaction["points"]
            transaction["spent"] = True

        elif transaction["points"] < points_to_spend and transaction["spent"] != True:
            data[transaction["payer"]] -= transaction["points"]
            points_to_spend -= transaction["points"]
            transaction["spent"] = True

        elif transaction["points"] >= points_to_spend and transaction["spent"] != True:
            data[transaction["payer"]] -= points_to_spend
            points_to_spend = 0
            if transaction["points"] - points_to_spend == 0:
                transaction["spent"] = True

    if data:
        for item in data:
            if data[item] > 0:
                return_data.append({"payer": item, "points": data[item]})

    else:
        return_data = []

    return return_data, 200


@app.route("/reset", methods=["POST"])
def reset():
    """
    Resets the data and transactions to empty
    """
    global data, transactions
    data, transactions = {}, []
    return [data], 201


@app.route("/download", methods=["GET"])
def download():
    """
    Downloads a CSV file container the payer and their total points
    """
    global data
    return_data = []

    if data:
        for item in data:
            if data[item] > 0:
                return_data.append({"payer": item, "points": data[item]})
    else:
        return "No data to download. Add transactions first", 400

    si = StringIO()
    csv_writer = csv.DictWriter(si, ["payer", "points"])
    csv_writer.writerows(return_data)
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=downloaded_data.csv"
    output.headers["Content-type"] = "text/csv"

    return output, 200


if __name__ == "__main__":
    app.run()
