const veritabani = require("./indexController");

exports.commentInsertController = async (req, res) => {
  try {

    const userID = req.session.userID;
    const locationID = req.query.locationID;
    const commentContents = req.query.commentContents;
    const commentDate = req.query.commentDate;
    const commentTitle = req.query.commentTitle;
    const commentScore = req.query.commentScore;
    await veritabani.insertComment(userID,locationID,commentContents,commentDate,commentTitle,commentScore);


  } catch (error) {
    console.error("commentWrite açılırken hata oluştu:", error);
    res.render("page404");
  }
};