const { GoogleGenAI } = require("@google/genai");

// Substitua 'SUA_API_KEY' pela sua chave de API real

const ai = new GoogleGenAI({});

async function processQueryWithLLM(userInput,Data,type) {
  let content = "";
  switch(type){
    case 1:
      content = `Considere esses um cenário no qual o usuário está tentando 
        filtrar uma base de dados com base nos nomes. 
        Para filtrar o usuário deve digitar um nome, ou algo próximo de um nome.
        Dado o cenário, considere que há os seguintes nomes na base de dados: ${Data}. 
        Considerando que o que o usuário digitou foi exatamente "${userInput}", qual pode ser o nome que deve ser filtrado?
        Retorne como resposta apenas os possíveis nomes no formato ["name1","name2",...,"namen"]`;
        break;
    case 2:
        content = `Considere esses um cenário no qual o usuário está tentando 
        filtrar uma base de dados com base nos nomes dos documentos. 
        Para filtrar o usuário deve digitar um nome, ou algo próximo de um nome.
        Dado o cenário, considere que há os seguintes nomes de documentos na base de dados: ${Data}. 
        Considerando que o que o usuário digitou foi exatamente "${userInput}", qual pode ser o nome que deve ser filtrado?
        Retorne como resposta apenas os possíveis nomes no formato [name1,name2,...,namen]`;
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
  });
  
  return response.text;
  //
}


module.exports =  processQueryWithLLM ;