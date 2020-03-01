const dictionary = {
  'personal': '私有',
  'borrowable': '可借', 
  'shared': '共享',
  'available': '空闲',
  'reading': '在读',
  'losted': '遗失',
  'requesting': '申请中',
  'accepted': '接受',
  'rejected': '拒绝',
  'lending': '借出(待接收)',
  'borrowing': '借出',
  'returning': '归还(待接收)',
  'finished': '完成',
  'canceled': '取消'
}

export default function translate(str) {
  return dictionary[str] || str;
}
