const https = require('node:https')
const querystring = require('node:querystring')
const _ = require('lodash')
const cheerio = require('cheerio')
const fs = require('fs')

// import * as cheerio from 'cheerio';

const getOptions = (options = {}, queryStr) => {
  const option = {
    hostname: 'o1r0gxad.yichafen.com',
    // path: '/public/verifycondition/sqcode/NsjcQnwmMjAyNHw2Y2M2ZjVhMzUwMWM5NjNjYmMyZDQ0YjdhOTZlNTZiYnxvMXIwZ3hhZAO0O0OO0O0O/from_device/mobile.html',
    path: options.path || '/public/queryresult/from_device/mobile.html',
    method: options.method || 'GET',
    headers: {
      Host: 'o1r0gxad.yichafen.com',
      Origin: 'https://o1r0gxad.yichafen.com',
      Referer: 'https://o1r0gxad.yichafen.com/qz/x8y95WC99t',
      connection: 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      Cookie: options.cookie || '',
      'accept-language': 'zh-CN,zh;q=0.9',
      'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      'sec-ch-ua-mobile': '?0',
      'Sec-Fetch-Dest': options.fetchDest || 'document',
      'Sec-Fetch-Mode': options.fetchMode || 'navigate',
      // 'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'sec-ch-ua-platform': '"macOS"'
    }
  }

  if (options.requestWith) {
    option.headers['x-requested-with'] = options.requestWith
  }

  if (_.lowerCase(options.method) === 'post') {
    option.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  if (queryStr) {
    option.headers['Content-Length'] = Buffer.byteLength(queryStr)
  }

  return option
}

const getCookie = () => {
  console.log('获取cookies')
  return new Promise((resolve, reject) => {
    const req = https.request(getOptions({
      path: '/'
    }), (res) => {
      const list = []

      res.on('data', chunk => {
        list.push(chunk)
      })

      res.on('end', () => {
        // console.log('vvv', Buffer.concat(list).toString())
        const cookies = res.headers['set-cookie']
        const cookieList = []
        _.map(cookies, (cookie) => {
          const [value] = _.split(cookie, ';')
          if (!cookieList.includes(value)) {
            cookieList.push(value)
          }
        })

        const cookieStr = cookieList.join('; ')

        resolve(cookieStr)
      })
    })

    req.on('error', (error) => {
      console.log('error', error)

      resolve('')
    })

    req.end()
  })
}

const getSearchScoreUrl = (cookie, name) => {
  const queryStr = querystring.stringify({ s_xingming: name })
  // console.log('获取分数查询接口', name)
  return new Promise((resolve) => {
    const option = getOptions({
      path: '/public/verifycondition/sqcode/NsjcQnwmMjAyNHw2Y2M2ZjVhMzUwMWM5NjNjYmMyZDQ0YjdhOTZlNTZiYnxvMXIwZ3hhZAO0O0OO0O0O/from_device/mobile.html',
      method: 'post',
      cookie,
      requestWith: 'XMLHttpRequest',
      fetchMode: 'cors',
      fetchDest: 'empty'
    }, queryStr)
    // console.log('option', option)
    const req = https.request(option, (res) => {
      const list = []

      res.on('data', chunk => {
        list.push(chunk)
      })

      res.on('end', () => {
        // console.log('dddddd', res.headers)
        const result = JSON.parse(Buffer.concat(list).toString()) || {}
        if (result.status !== 1) {
          console.log('姓名', name, result.info)
        }
        resolve(result.url)
      })
    })

    req.write(queryStr)

    req.on('error', (error) => {
      console.log('error', error)

      resolve('')
    })

    req.end()
  })
}

const getScore = (cookie, path, name) => {
  return new Promise((resolve) => {
    const req = https.request(getOptions({
      path,
      cookie
    }), (res) => {
      const list = []

      res.on('data', chunk => {
        list.push(chunk)
      })

      res.on('end', () => {
        // console.log('dddddd', res.headers)
        const html = Buffer.concat(list).toString()

        const score = {}
        if (html) {
          const $ = cheerio.load(html)
          // console.log('html', html)
          // console.log('aaa', $('#result_data_table').find('tr').length)
          $('#result_data_table').find('tr').map((item, el) => {
            // console.log('bbb', $(el).html())
            const key = $(el).find('span').text()
            const value = $(el).find('td').eq(1).text()
            // console.log('info', key, value)
            if (!['学号'].includes(key)) {
              score[key] = value * 1 ? value * 1 : value
            }
          })

          // console.log('score 获取成功')
          resolve(score)
        } else {
          console.log('getScore, 获取数据为空', name)
        }

        resolve(score)
      })
    })

    req.on('error', (error) => {
      console.log('error' + name, error)

      resolve('')
    })

    req.end()
  })
}

const writeFile = (data, file) => {
  try {
    fs.writeFileSync(`/Users/linchuzhong/Documents/my/family/${file || 'score.json'}`, data)
  } catch (err) {
    console.log('写入文件失败')
  }
}

const filterSubject = (list, subject) => {
  return _.filter(list, (item) => {
    const [key] = _.entries(item)

    return [subject, '姓名'].includes(key)
  })
}

const allName = [
  '林铭烽', '邝锐坤', '祝泳姗', '包晓雅', '陈锦鹏', '陈俊', '陈玮琳', '陈永烽', '陈阅', '陈芷澄', '邓智霖', '冯鑫源',
  '冯钊成', '郭德轩', '何进鹏', '何思彤', '何兆宇', '黄焯羿', '黄浩霖', '黄嘉琪', '黄妙韵', '黄星然', '黄仲菁', '孔丽琪',
  '李伯明', '李德臻', '李翰', '李金诚', '李书晴', '廖洁鑫', '刘炳胜', '莫钰儿', '缪梓彤', '欧永骏', '戚钰茹', '丘泓毅',
  '区诗岚', '谭贺元', '唐凯奕', '谢芳莹', '许铭轩', '许晓源', '杨淑言', '叶烔', '曾昊骏', '钟雨潼'
]
const init = async () => {
  // const cookie = await getCookie()
  const cookie = 'aliyungf_tc=320c2f9501ac4c4c5dbb8cc41f29cc6e2b462a1edc628535c573c8369639023e; PHPSESSID=iga93g7q9ehkbs2hqfihm272e0; acw_tc=ac11000117298417599624937eb760bb7f70039e79ef2ff500ed8d7caecadf'
  console.log(cookie ? 'cookie 获取成功' + cookie : 'cookie 获取失败')
  if (!cookie) return

  // await sleep()

  const allScore = []
  for (let i = 0; i < allName.length; i += 1) {
    const name = allName[i]
    const url = await getSearchScoreUrl(cookie, name)

    // console.log(url ? 'getSearchScoreUrl 获取成功' + url : 'getSearchScoreUrl 获取失败')

    if (!url) continue
    const scores = await getScore(cookie, url, name)

    allScore.push(scores)
  }

  // 所有人的分数写入文件
  // console.log('开始写入 所有分数')
  // writeFile(JSON.stringify(allScore) + '\r\n')

  // 分析总分排名
  console.log('开始分析总分排名')
  const totalScore = _.orderBy(allScore, ['中考总分'], ['desc'])
  writeFile(JSON.stringify(totalScore) + '\r\n')

  // 分析单科排名
  console.log('开始分析语文排名')
  const yuwenScore = _.orderBy(allScore, ['语文'], ['desc'])
  writeFile(JSON.stringify(yuwenScore) + '\r\n', 'yuwen.json')

  console.log('开始分析数学排名')
  // const shuxueList = filterSubject(allScore, '数学')
  const shuxueScore = _.orderBy(allScore, ['数学'], ['desc'])
  writeFile(JSON.stringify(shuxueScore) + '\r\n', 'shuxue.json')

  console.log('开始分析英语排名')
  // const yingyuList = filterSubject(allScore, '英语')
  const yingyuScore = _.orderBy(allScore, ['英语'], ['desc'])
  writeFile(JSON.stringify(yingyuScore) + '\r\n', 'yingyu.json')

  // console.log('allScore', allScore)
}

init()

// const req = https.request(options, res => {
//   const list = []
//   res.on('data', chunk => {
//     list.push(chunk)
//   })
//   res.on('end', () => {
//     console.log('end', list);
//     console.log(Buffer.concat(list).toString())
//   })
// }).on('error', err => {
//   console.log('Error: ', err.message)
// })

// req.write('s_xingming=%E6%9E%97%E9%93%AD%E7%83%BD')

// req.end()
