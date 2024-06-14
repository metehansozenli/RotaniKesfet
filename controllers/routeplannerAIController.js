const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.routeplannerAIController = async (req, res) => {

  try {

    var answer;
    const userQuestion = req.query.userQuestion;
    const isFirst = req.query.isFirst;
    const promptFirst = `
    Bir rota planlama web sitesi için akıllı bir seyahat asistanı botusunuz. Birincil göreviniz kullanıcılara seyahat ve şehir bilgileri sağlamaktır. Şehirler ve seyahat rotaları hakkında detaylı ve faydalı bilgiler bulmalı ve vermelisiniz. Bir kullanıcı seyahat veya şehir bilgisi dışında bir soru sorarsa, o konuda yardımcı olamayacağınızı kibarca yanıtlarsınız.
    Kullanıcıyı selamlayarak ve seyahat planlarında Türkçe olarak onlara nasıl yardımcı olabileceğinizi sorarak başlayın.
    `;
    
    var prompt = `
    Şehir ve seyahat bilgilerini sağlayabilirsiniz.
    
    Kullanıcı bir soru sorduğunda:
    - Sorunun bir şehirle mi yoksa seyahat rotasıyla mı ilgili olduğunu belirleyin. Ek bilgi sormadan soruyu cevaplamanız yeterli.
    - Soru kapsamınızın dışındaysa şu şekilde yanıt verin: "Üzgünüm, yalnızca seyahat ve şehir bilgileri konusunda yardımcı olabilirim."
    "Kullanıcı Sorusu: ${userQuestion}"
    
    Lütfen kullanıcının sorusuna ekstra bir soru sorma, ekstra bir bilgi talep etme. Ancak detaylı cevap ver.
    
    NOT: Kullanıcıya herhangi bir soru soramazsınız!
    NOT2: Yalnızca şehir ve seyahat bilgileriyle ilgili soruları yanıtlamanıza izin verilir.
    `;
    
    async function generateResponse(query) {
        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();
        return text;
    }
    
    if(isFirst == 1){ // İlk defa istek atıldıysa karşılama mesaji gonder.
      answer = await generateResponse(promptFirst)
      console.log(answer)
    }
    else{
      answer = await generateResponse(prompt);
      console.log(answer)
    } 

    res.json(answer); // Sonuçları JSON olarak gönder

  } catch (error) {
    console.error("AI a bağlanırken hata oluştu:", error);
    res.render("page404");
  }
};