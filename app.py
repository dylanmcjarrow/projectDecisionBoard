from flask import Flask, url_for, render_template, jsonify, request
from json import loads, dump, load

api_key = "123"
app = Flask(__name__)

menArr = []
grpArr = []


def innit_arrs():
    global menArr, grpArr

    with open('data.json') as json_file:
        data = load(json_file)
    menArr = data["mentor"]
    grpArr = data["group"]


@app.route('/')
def hello_world():
    innit_arrs()
    return render_template("index.html")


@app.route('/api', methods=['GET', 'POST'])
def api():
    global menArr
    global grpArr
    method = request.method
    params = request.args

    if method == 'GET':
        if not params:
            return "400"
        elif params["key"] == api_key:
            response = jsonify(
                mentor_array=menArr,
                group_array=grpArr
            )
        else:
            response = jsonify(
                mentor_array=[],
                group_array=[]
            )
        return response
    elif method == 'POST':
        print(params)
        if not params:
            return "400"
        elif params["key"] == api_key:
            body = request.data
            data = loads(body)
            if data["listName"] == "group":
                try:
                    grpArr = data["data"]
                except Exception as e:
                    print(e)
                    return "400"
            elif data["listName"] == "mentor":
                try:
                    menArr = data["data"]
                except Exception as e:
                    print(e)
                    return "400"
            else:
                return "400"

        with open('data.json', 'w', encoding='utf-8') as outfile:
            outfile.truncate()
            arr_json = {"mentor": menArr, "group": grpArr}
            dump(arr_json, outfile, ensure_ascii=False, indent=4)

        return "200"
    else:
        return "400"


if __name__ == '__main__':
    app.run()
