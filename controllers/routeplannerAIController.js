const veritabani = require("./indexController");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

exports.routeplannerAIController = async (req, res) => {
  try {


    


  } catch (error) {
    console.error("AI a bağlanırken hata oluştu:", error);
    res.render("page404");
  }
};