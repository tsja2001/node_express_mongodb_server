exports.list = async (req, res, next) => {
  console.log(req.method)
  res.send('/video-list')
}

exports.delete = async (req, res, next) => {
  console.log(req.method)
  res.send('/video-list')
}
