import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [people, setPeople] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    team: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/people');
        setPeople(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPeople();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await axios.put(`http://127.0.0.1:5000/person/${currentId}`, formData);
        setPeople(people.map(person => (person.id === currentId ? response.data : person)));
        setIsEditing(false);
        setFormData({ first_name: '', last_name: '', birth_date: '', gender: '', team: '' });
        setCurrentId(null);
      } else {
        const response = await axios.post('http://127.0.0.1:5000/person', formData);
        setPeople([...people, response.data]);
        setFormData({ first_name: '', last_name: '', birth_date: '', gender: '', team: '' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    const person = people.find(person => person.id === id);
    setFormData({
      first_name: person.first_name,
      last_name: person.last_name,
      birth_date: person.birth_date,
      gender: person.gender,
      team: person.team
    });
    setIsEditing(true);
    setCurrentId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/person/${id}`);
      setPeople(people.filter(person => person.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-full'>
      <div className="w-full p-3 text-center text-5xl">
        <h1>KİŞİLER</h1>
      </div>
      <div className='w-full p-2 text-center'>
      <form onSubmit={handleSubmit}>
        <input
          className='p-2 border-2 rounded-lg mx-1'
          type="text"
          name="first_name"
          placeholder="İsim"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          className='p-2 border-2 rounded-lg mx-1'
          type="text"
          name="last_name"
          placeholder="Soyisim"
          value={formData.last_name}
          onChange={handleChange}
        />
        <input
          className='p-2 border-2 rounded-lg mx-1'
          type="date"
          name="birth_date"
          placeholder="Doğum Tarihi"
          value={formData.birth_date}
          onChange={handleChange}
        />
         <select
          className='p-2 border-2 rounded-lg mx-1'
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Cinsiyet</option>
          <option value="Erkek">Erkek</option>
          <option value="Kadın">Kadın</option>
          <option value="Diğer">Diğer</option>
        </select>
        <input
          className='p-2 border-2 rounded-lg mx-1'
          type="text"
          name="team"
          placeholder="Tuttuğu Takım"
          value={formData.team}
          onChange={handleChange}
        />
        <button className='p-2 border-2 rounded-lg mx-1 bg-sky-500/75' type="submit">{isEditing ? 'Güncelle' : 'Ekle'}</button>
      </form>
      </div>
      <div className='w-full p-2 text-center'>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th className='px-6 py-3'>Ad Soyad</th>
            <th className='px-6 py-3'>Doğum Tarihi</th>
            <th className='px-6 py-3'>Cinsiyet</th>
            <th className='px-6 py-3'>Tuttuğu Takım</th>
            <th className='px-6 py-3'>İşlem</th>
          </tr>
        </thead>
        <tbody>
        {people.map(person => (
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' key={person.id}>
            <td className='px-6 py-4'>{person.first_name} {person.last_name}</td> 
            <td className='px-6 py-4'>{person.birth_date}</td>
            <td className='px-6 py-4'>{person.gender}</td>
            <td className='px-6 py-4'>{person.team}</td>
            <td className='px-6 py-4'><button className='p-2 border rounded-lg mx-1 bg-gray-500' onClick={() => handleEdit(person.id)}>Düzenle</button>
            <button className='p-2 border rounded-lg mx-1 bg-gray-500' onClick={() => handleDelete(person.id)}>Sil</button></td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}

export default App;
