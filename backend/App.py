from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///people.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "*"}})

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    team = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'birth_date': self.birth_date.strftime('%Y-%m-%d'),
            'gender': self.gender,
            'team': self.team
        }

@app.route('/people', methods=['GET'])
def get_people():
    people = Person.query.all()
    return jsonify([person.to_dict() for person in people])

@app.route('/person/<int:id>', methods=['GET'])
def get_person(id):
    person = Person.query.get_or_404(id)
    return jsonify(person.to_dict())

@app.route('/person', methods=['POST'])
def add_person():
    data = request.get_json()
    new_person = Person(
        first_name=data['first_name'],
        last_name=data['last_name'],
        birth_date=datetime.strptime(data['birth_date'], '%Y-%m-%d'),
        gender=data['gender'],
        team=data['team']
    )
    db.session.add(new_person)
    db.session.commit()
    return jsonify(new_person.to_dict()), 201

@app.route('/person/<int:id>', methods=['PUT'])
def update_person(id):
    data = request.get_json()
    person = Person.query.get_or_404(id)

    person.first_name = data['first_name']
    person.last_name = data['last_name']
    person.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d')
    person.gender = data['gender']
    person.team = data['team']

    db.session.commit()
    return jsonify(person.to_dict())

@app.route('/person/<int:id>', methods=['DELETE'])
def delete_person(id):
    person = Person.query.get_or_404(id)
    db.session.delete(person)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
