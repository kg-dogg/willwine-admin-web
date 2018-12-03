/* eslint-disable */
let expireTime = '';
let api = '';
let players = {};
let isIOS = '';
const insertAfter = (newelement, targetelement) => {
  const { parentNode } = targetelement;
  if (parentNode.lastChild === targetelement) {
    parentNode.appendChild(newelement);
  } else {
    parentNode.insertBefore(newelement, targetelement);
  }
};

const Post = (url, queryBody) => {
  return new Promise((resolve) => {
    let xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.setRequestHeader("Accept", 'application/json');
    xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    xmlhttp.setRequestHeader('Access-Control-Allow-Headers', 'Origin, No-Cache, X-Requested-With, Accept, Authorization, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
    xmlhttp.send(queryBody);
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        resolve(JSON.parse(xmlhttp.responseText));
      }
    }
  })
}


const getSTS = (apiRoot, cdnRoot) => {
  const queryBody = JSON.stringify({"query":"query querySTS {stsplay}"});
  Post(`${apiRoot}graphql/noauth`, queryBody).then((v) => {
    const STS = JSON.parse(v.data.stsplay);
    coverVideo(STS.Credentials, cdnRoot);
    expireTime = new Date(STS.Credentials.Expiration).getTime();
    // expireTime = new Date('2018-10-17T11:38:36Z').getTime();
  });
}

const destroyPlayers = () => {
  document.querySelectorAll('.videoWrapper').forEach(item => item.parentNode.removeChild(item));
  console.log('destroyed');
  getSTS(api);
}

const checkExpireTime = (e) => {
  const now = new Date().getTime();
  if (expireTime && (now >= expireTime)) {
    destroyPlayers();
    return;
  };
  pauseOtherMedia(e.target.querySelector('video'));
}

const initPlayer = (id, video, STS) => {
  const vid = video.getAttribute('vid');
  const player = new Aliplayer({
    id,
    source: vid && STS ? '' : video.src,
    vid,
    accessKeyId: (STS && STS.AccessKeyId) || '',
    securityToken: (STS && STS.SecurityToken) || '',
    accessKeySecret: (STS && STS.AccessKeySecret) || '',
    width: '100%',
    height: '100%',
    videoWidth: '100%',
    cover: video.poster,
    autoplay: false,
    isLive: false,
    useH5Prism: true,
    rePlay: false,
    playsinline: true,
    preload: false,
    controlBarVisibility: 'hover',
    useH5Prism: true,
    skinLayout: [
      {
        name: 'bigPlayButton',
        align: 'cc',
      },
      {
        name: 'H5Loading',
        align: 'cc',
      },
      {
        name: 'errorDisplay',
        align: 'tlabs',
        x: 0,
        y: 0,
      },
      {
        name: 'controlBar',
        align: 'blabs',
        x: 0,
        y: 0,
        children: [
          {
            name: 'progress',
            align: 'blabs',
            x: 0,
            y: 44,
          },
          {
            name: 'playButton',
            align: 'tl',
            x: 15,
            y: 12,
          },
          {
            name: 'fullScreenButton',
            align: 'tr',
            x: 10,
            y: 12,
          },
        ],
      },
    ],
  }, (player) => {
    setTimeout(() => {
      document.querySelector(`#${id}`).style.visibility = 'visible';
    }, 500);
    document.querySelector(`#${id} video`).poster = video.poster;
    player.on('play', checkExpireTime);
    if (isIOS) {
      player.on('requestFullScreen',() => {
        player._el.querySelector('.prism-fullscreen-btn').className = 'prism-fullscreen-btn';
      })
    }
    players[id] = player;
  });
};

const coverVideo = (STS, cdnRoot) => {
  const vids = document.querySelectorAll('video');
  vids.forEach((vid) => {
    const coverWrapper = document.createElement('div');
    coverWrapper.className = 'videoWrapper';
    const cover = document.createElement('div');
    if (!isIOS) {
      const reverseBtn = document.createElement('button');
      reverseBtn.className = 'reverseBtn';
      reverseBtn.style.backgroundImage = `url(${cdnRoot}static/images/rotate_play_btn.png)`;
      cover.appendChild(reverseBtn);
      reverseBtn.addEventListener('click', (e) => {
        const video = e.target.parentNode.querySelector('video');
        video.className = video.className ? '' : 'reverse';
      });
    }
    cover.id = `video${+new Date() - Math.random().toString().substr(2,5)}`;
    cover.style.visibility = 'hidden';
    coverWrapper.appendChild(cover);
    insertAfter(coverWrapper, vid);
    setTimeout(initPlayer,0, cover.id, vid, STS);
  });
};

const completeAudioImgUrl = () => {
document.querySelectorAll('.audio-wrap').forEach((item) => {
  const urlArr = item.style.backgroundImage.split('//');
  const audioPauseImg = `url('https://${urlArr[1].slice(0, -2)}')`;
  const audioPlayedImg = `${audioPauseImg.split('images')[0]}images/audio-played.gif')`;
  item.style.backgroundImage = audioPauseImg;
  const audio = item.querySelector('audio');
  audio.addEventListener('play', () => {
    item.style.backgroundImage = audioPlayedImg;
  });
  audio.addEventListener('pause', () => {
    item.style.backgroundImage = audioPauseImg;
  });
});
}

const pauseOtherMedia = (media) => {
  const mediaArray = Array.from(document.querySelectorAll('video, audio'));
  mediaArray.forEach(v => v !== media && v.pause());
}

const addEventAudio = () => {
  const audio = Array.from(document.querySelectorAll('audio'));
  audio.forEach((item) => {
    item.addEventListener('play', pauseOtherMedia.bind(null, item));
  });
}

const init = (apiRoot, cdnRoot) => {
  isIOS = navigator.userAgent.match(/iPhone|iPod/i);
  document.querySelectorAll('video').forEach((vid) => {
    vid.style.display = 'none';
  });
  addEventAudio();
  completeAudioImgUrl();
  api = apiRoot;
  getSTS(apiRoot, cdnRoot);
}
window.initAliplayer = init;
