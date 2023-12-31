import ScoreService from "../service/ScoreService";

const getAllScore = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      let search = req.query.search;
      let timeId = req.query.timeId;
      let teacherUserId = req.query.teacherUserId;

      const data = await ScoreService.getScorePagination({
        page,
        limit,
        search,
        timeId,
        teacherUserId,
      });
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let timeId = req.query.timeId;
      let teacherUserId = req.query.teacherUserId;
      const score = await ScoreService.getScoreList({ timeId, teacherUserId });
      return res.status(200).json({
        EM: score.EM,
        EC: score.EC,
        DT: score.DT,
      });
    }
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const getScoreById = async (req, res) => {
  try {
    const score = await ScoreService.getScoreById(+req.query.id);
    return res.status(200).json({
      EM: score.EM,
      EC: score.EC,
      DT: score.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

// const postCreateScore = async (req, res) => {
//   try {
//     let scoreData = await ScoreService.createScore(req.body);
//     return res.status(200).json({
//       EM: scoreData.EM,
//       EC: scoreData.EC,
//       DT: scoreData.DT,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       EM: "Internal Server Error",
//       EC: -1,
//       DT: "",
//     });
//   }
// };

const putUpdateScore = async (req, res) => {
  try {
    let updateInfo = await ScoreService.updateScore(
      { score: +req.body.score },
      +req.params.id
    );
    return res.status(200).json({
      EM: updateInfo.EM,
      EC: updateInfo.EC,
      DT: updateInfo.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

const putUpdateSubmitLink = async (req, res) => {
  try {
    let updateInfo = await ScoreService.updateSubmitLink(
      +req.params.id,
      req.body.submitLink
    );
    return res.status(200).json({
      EM: updateInfo.EM,
      EC: updateInfo.EC,
      DT: updateInfo.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Internal Server Error",
      EC: -1,
      DT: "",
    });
  }
};

// const handleDeleteScore = async (req, res) => {
//   try {
//     console.log(">>> req.body", req.body);
//     let deleteInfo = await ScoreService.deleteScore(req.body.ids);
//     return res.status(200).json({
//       EM: deleteInfo.EM,
//       EC: deleteInfo.EC,
//       DT: deleteInfo.DT,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       EM: "Internal Server Error",
//       EC: -1,
//       DT: "",
//     });
//   }
// };

module.exports = {
  getAllScore,
  getScoreById,
  putUpdateScore,
  putUpdateSubmitLink,
};
