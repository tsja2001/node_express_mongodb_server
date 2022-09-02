// 用于实现阿里云的身份验证
var RPCClient = require('@alicloud/pop-core').RPCClient

function initVodClient(accessKeyId, accessKeySecret) {
  var regionId = 'cn-shanghai' // 点播服务接入地域
  var client = new RPCClient({
    //填入AccessKey信息
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
    apiVersion: '2017-03-21'
  })

  return client
}

exports.getvod = async (req, res, next) => {
  var client = initVodClient(
    'LTAI5tLXU9e32uEDFFQ5zotH',
    'hnkDEePZtSz72CaiOJDVCq50STucTB'
  )

  try {
    const vodback = await client.request(
      'CreateUploadVideo',
      {
        Title: 'this is a sample',
        FileName: 'filename.mp4'
      },
      {}
    )

    res.status(200).json({ vod: vodback })
  } catch (err) {
    res.status(500).json({ err: err })
  }
}
