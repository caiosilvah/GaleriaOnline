import './Galeria.css';
import icon from "../../assets/img/upload.svg";
import { Botao } from '../../components/botao/Botao';
import { Card } from '../../components/card/Card';
import { useEffect, useState } from 'react';
import api from '../../Services/services';

export const Galeria = () => {

    const [cards, setCards] = useState([]);
    const [imagem, setImagem] = useState(null);
    const [nomeImagem, setNomeImagem] = useState("");

    async function listarCards() {
        try {
            const resposta = await api.get("Imagem");
            setCards(resposta.data);

        } catch (error) {
            console.error(error);
            alert("Erro ao listar.");
        }
    }

    async function cadastrarCard(e) {

        e.preventDefault();

        if (imagem && nomeImagem) {
            try {
                //FormData e uma interface JavaScript Que permite construir um conjunto de pares chave/valor representando os dados de um formulario HTML.
                const formData = new FormData();
                //append: anexar/acrescentar/adicionar
                formData.append("Nome", nomeImagem);
                formData.append("Arquivo", imagem);

                await api.post("Imagem/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                alert("Pabens, seu cadastro foi realizado!!!")
                listarCards();

            } catch (error) {
                alert("Não foi possivel realizar o cadastro!")
                console.error(error);
            }
        } else {
            alert("Preencha os campos de Nome e Imagem!")
        }
    }

    function editarCard(id, nomeAntigo) {
       
            const novoNome = prompt("Digite o novo nome da imagem:", nomeAntigo);

            const inputArquivo = document.createElement("input");
            inputArquivo.type = "file";
            inputArquivo.accept = "image/*";
            //<input>= "file" accepet="image/*"</input>

            //Define o que acontece quando o usuario selecionar um arquivo
            inputArquivo.onchange = async (e) => {
                const novoArquivo = e.target.files[0];

                const formData = new FormData();
                //Adicionar o novo nome no formData:
                formData.append("Nome", novoNome);
                formData.append("Arquivo", novoArquivo);

                if (formData) {
                    try {
                        await api.put(`Imagem/${id}`, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        })
                        
                        alert("ebaa deu certo!")
                        listarCards();
                    } catch (error) {
                        alert("Não foi possivel alterar o card !")
                        console.error(error);
                    }
                    
                }
            };
            inputArquivo.click();

       
    }

    async function excluirCard(id) {
        try {
            await api.delete(`Imagem/${id}`);
            alert("Excluiuuuuu!!!");
        } catch (error) {
            alert("Erro ao excluir o card!");
            console.error(error);
        }
    }

    useEffect(() => {
        listarCards();
    });

    return (
        <>
            <h1 className='tituloGaleria'>Galeria Online</h1>
            <form className='formulario' onSubmit={cadastrarCard}>
                <div className='campoNome'>
                    <label>Nome</label>
                    <input type="text" className='inputNome' onChange={(e) => setNomeImagem(e.target.value)} value={nomeImagem} />
                </div>
                <div className='campoImagem'>
                    <label className='arquivoLabel'>
                        <i>
                            <img src={icon} alt="Ícone de upload de imagem" />
                        </i>
                        <input type="file" className="arquivoInput" onChange={(e) => setImagem(e.target.files[0])} />
                    </label>
                </div>
                <Botao nomeBotao="Cadastrar" />
            </form>

            <div className='campoCards'>
                {cards.length > 0 ? (
                    cards.map((e) => (
                        <Card
                            key={e.id}
                            tituloCard={e.nome}
                            imgCard={`https://localhost:7009/${e.caminho.replace("wwwroot/", "")}`}
                            funcaoExcluir={() => excluirCard(e.id)}
                            funcaoEditar={() => editarCard(e.id, e.nome)}
                        />
                    ))
                ) : (
                    <p>Nenhum Card cadastrado</p>
                )}
            </div>
        </>
    );
};
