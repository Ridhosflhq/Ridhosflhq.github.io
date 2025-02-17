from flask import Flask, request, jsonify
import herepy

app = Flask(__name__)

# Ganti dengan kunci API Anda
app_id = "GwpZEfnLosNWeT7S677Y"
app_code = "GKZLANT5uQD44ndmqY60txqDGoeDvNzSRmxZZC7Qi4A"

routing_api = herepy.RoutingApi(app_id, app_code)

@app.route('/route', methods=['POST'])
def get_route():
    data = request.get_json()
    origin = data.get('origin')
    destination = data.get('destination')

    if origin and destination:
        try:
            response = routing_api.get_route(
                origin=f"{origin[0]},{origin[1]}",
                destination=f"{destination[0]},{destination[1]}",
                mode=herepy.RouteMode.car,
                representation=herepy.RouteRepresentation.overview
            )

            if response.ok:
                route = response.data['response']['route'][0]
                return jsonify({'route': route})
            else:
                return jsonify({'error': 'Gagal mendapatkan rute dari HERE API.'}), response.status_code
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Asal dan/atau tujuan tidak boleh kosong.'}), 400

if __name__ == '__main__':
    app.run(debug=True)
