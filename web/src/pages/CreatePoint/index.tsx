import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

interface Item {
    id: number;
    name: string;
    imageUrl: string;
}

interface Uf {
    id: number,
    sigla: string,
    nome: string
}

interface Cities {
    id: number,
    nome: string
}

const CreatePoint = () => {

    const [items, setItems] = useState <Item[]>([]);
    const [ufs, setUfs] = useState<Uf[]>([]);
    const [cities, setCities] = useState<Cities[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0')
    const [actualPosition, setActualPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude} = position.coords;
            setInitialPosition([
                latitude, longitude
            ]);
        });
    }, []);

    useEffect(() => {
        const response = api.get('/items')
            .then(response => {
                setItems(response.data);
            })
            .catch(err => {
                alert('Impossível se conectar com o servidor.');
            });
        
    }, []);

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                setUfs(response.data);
            })
            .catch(err => {
                alert(err);
            });
    });

    useEffect(() => {
        if(selectedUf === "0") {
            setCities([]);
            return;
        } 
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            setCities(response.data);
        })
        .catch(err => {
            alert(err);
        });
    }, [selectedUf]);

    const handleSelectUf = (e: ChangeEvent<HTMLSelectElement>) => {
        const uf = e.target.value;
        setSelectedUf(uf);
    }

    const handleSelectCity = (e: ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setSelectedCity(city);
    }

    const handleMouseClick = (e: LeafletMouseEvent) => {
        setActualPosition([
            e.latlng.lat,
            e.latlng.lng
        ]);
    }

    const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value });
    }

    const handleSelectObject = (id: number) => {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0) {
            const newArray = selectedItems.filter(item => item !== id);
            setSelectedItems(newArray);
        }
        else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = actualPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        await api.post('points', data);
        alert('criei');
        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Retornar
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputs}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputs}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputs}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onCLick={handleMouseClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={actualPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0" >Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option
                                        key={uf.id}
                                        value={uf.sigla}
                                    >
                                        {`${uf.nome} - ${uf.sigla}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaxo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectObject(item.id)}
                                className={selectedItems.includes(item.id) ? "selected": ""}>
                                <img src={item.imageUrl} alt="item"/>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint;