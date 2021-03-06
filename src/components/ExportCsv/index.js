const newLine = '\r\n';
const separator = ',';
const csv = {
  _appendLine(content, columns, row) {
    let cells;
    if(row){
      cells = columns.map(element => {
        return row[element.prop] || ''
      });
    }else{
      cells = columns.map(item => {
        return item.title;
      });
    }
    content.push(cells.join(separator));
  },
  toCsvText(columns, rows) {
    let content = []
    this._appendLine(content,columns,null)
    rows.forEach(element => {
      this._appendLine(content,columns,element)
    });
    return content.join(newLine);
  }
}
const downloader = {
  _has(browser) {
    const ua = navigator.userAgent;
    if (browser === 'ie') {
      const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1;
      if (isIE) {
        const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(ua);
        return parseFloat(RegExp['$1']);
      } else {
        return false;
      }
    } else {
      return ua.indexOf(browser) > -1;
    }
  },
  _isIE11() {
    let iev = 0;
    const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    const trident = !!navigator.userAgent.match(/Trident\/7.0/);
    const rv = navigator.userAgent.indexOf('rv:11.0');

    if (ieold) {
      iev = Number(RegExp.$1);
    }
    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
      iev = 10;
    }
    if (trident && rv !== -1) {
      iev = 11;
    }

    return iev === 11;
  },

  _isEdge() {
    return /Edge/.test(navigator.userAgent);
  },

  _getDownloadUrl(text) {
    const BOM = '\uFEFF';
    // Add BOM to text for open in excel correctly
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      const csvData = new Blob([BOM + text], {
        type: 'text/csv'
      });
      return URL.createObjectURL(csvData);
    } else {
      return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text);
    }
  },

  download(filename, text) {
    if (this._has('ie') && this._has('ie') < 10) {
      // has module unable identify ie11 and Edge
      const oWin = window.top.open('about:blank', '_blank');
      oWin.document.charset = 'utf-8';
      oWin.document.write(text);
      oWin.document.close();
      oWin.document.execCommand('SaveAs', filename);
      oWin.close();
    } else if (this._has('ie') === 10 || this._isIE11() || this._isEdge()) {
      const BOM = '\uFEFF';
      const csvData = new Blob([BOM + text], {
        type: 'text/csv'
      });
      navigator.msSaveBlob(csvData, filename);
    } else {
      const link = document.createElement('a');
      link.download = filename;
      link.href = this._getDownloadUrl(text);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

export default function exportCsv(filename, columns, rows) {
  const text = csv.toCsvText(columns, rows)
  downloader.download(filename, text)
}
