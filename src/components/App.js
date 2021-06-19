import React, { Component } from "react";
import axios from "axios";
import "./assets/App.css";
//Aplicando estilização com "bootstrap" feita a instalação previa do pacote com npm i bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//Usando janelas com estilo "Modal" feita a instalação previa do pacote Reactstrap com npm i reactstrap
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
//Insertando elementos icons desde o framework FontAwesome feita a instalação previa dos pacotes npm i --save @fortawesome/fontawesome-svg-core npm install --save @fortawesome/free-solid-svg-icons npm install --save @fortawesome/react-fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

//Declarando constante a porta do json-server após forçar ele criando uma script no package.json
const url = "http://localhost:5000/contacts/";

class App extends Component {
  state = {
    data: [],
    modoInsert: false,
    modoDelet: false,
    form: {
      id: "",
      name: "",
      email: "",
      phone: "",
      tipoModo: "",
    },
  };

  metGet = () => {
    axios
      .get(url)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  metPost = async () => {
    delete this.state.form.id;
    await axios
      .post(url, this.state.form)
      .then((response) => {
        console.log(response);
        this.modoInsert();
        this.metGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  metPut = () => {
    axios.put(url + this.state.form.id, this.state.form).then((response) => {
      this.modoInsert();
      this.metGet();
    });
  };

  metDelete = () => {
    axios.delete(url + this.state.form.id).then((response) => {
      this.setState({ modoDelet: false });
      this.metGet();
    });
  };

  modoInsert = () => {
    this.setState({ modoInsert: !this.state.modoInsert });
  };

  selecContacts = (contacts) => {
    this.setState({
      tipoModo: "atualizar",
      form: {
        id: contacts.id,
        name: contacts.name,
        email: contacts.email,
        phone: contacts.phone,
      },
    });
  };

  handleChange = async (event) => {
    event.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [event.target.name]: event.target.value,
      },
    });
    console.log(this.state.form);
  };

  componentDidMount() {
    this.metGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div style={{ display: "flex", flexDirection: "column" }} className="App">
        <h1 style={{ display: "flex", fontSize: 80, textAlign: "center" }}>
          Agenda de Contatos
        </h1>
        <button
          className="btn btn-success"
          onClick={() => {
            this.setState({ form: null, tipoModo: "insertar" });
            this.modoInsert();
          }}
        >
          Cadastrar Contato ✅
        </button>
        <br />
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>#️⃣</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((contacts) => {
              return (
                <tr>
                  <td>{contacts.id}</td>
                  <td>{contacts.name}</td>
                  <td>{contacts.email}</td>
                  <td>{contacts.phone}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.selecContacts(contacts);
                        this.modoInsert();
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {"  |  "}
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.selecContacts(contacts);
                        this.setState({ modoDelet: true });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modoInsert}>
          <ModalHeader style={{ display: "block" }}>
            <span
              style={{ float: "right", cursor: "pointer" }}
              onClick={() => this.modoInsert()}
            >
              ❌
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">#</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : this.state.data.length + 1}
              />
              <br />
              <label htmlFor="name">Nome</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                onChange={this.handleChange}
                value={form ? form.name : ""}
              />
              <br />
              <label htmlFor="email">Email</label>
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
                onChange={this.handleChange}
                value={form ? form.email : ""}
              />
              <br />
              <label htmlFor="phone">Telefone</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                onChange={this.handleChange}
                value={form ? form.phone : ""}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            {this.state.tipoModo === "insertar" ? (
              <button
                className="btn btn-success"
                onClick={() => this.metPost()}
              >
                Cadastrar
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => this.metPut()}>
                Editar
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => this.modoInsert()}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modoDelet}>
          <ModalBody>
            Esta certo de eliminar o contato "{form && form.name}" ?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.metDelete()}>
              Sim
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => this.setState({ modoDelet: false })}
            >
              Não
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default App;
