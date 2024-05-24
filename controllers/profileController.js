const veritabani = require("./indexController")


exports.changeProfile = async (req, res) => {
    
    const userSession = req.session;
    if (!userSession.userMail) { // Oturum yoksa
        res.redirect("/")
    }
    else{
        try {

            const userData = await veritabani.getProfileInfo(userSession.userID);
            if (userData) {
                const [userName, userSurname, userPhoneNo,userMail,userPass,userImg ] = userData;
                res.render("profile", {
                    userName: userName,
                    userSurname: userSurname,
                    userMail : userMail,
                    userPhoneNo: userPhoneNo,
                    userPass : userPass,
                    userImg: userImg,

                    
                });
            } else {
                res.send("Bir hata Oluştu!");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.render("page404");
        }
    }  
}
   
  