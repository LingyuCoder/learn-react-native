'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  NavigatorIOS,
  Image,
  Component
} = React;

function getDateDetail(date) {
  return {
    year: date.getYear() + 1900,
    month: date.getMonth() + 1,
    day: date.getDate()
  };
};

var styles = StyleSheet.create({
    calendar: {   
      flex: 1,    
      backgroundColor: '#333'
    },
    row: {
      flexDirection: 'row',
      height: 50
    },
    day: {
      flex: 1,
      height: 50,
    },
    title: {
      flexDirection: 'row',
      height: 50
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      color: '#98cd60',
      fontWeight: 'bold'
    },
    headText: {
      color: '#5b5b5b'
    },
    dayText: {
      color: '#9d9d9d'
    },
    curDayText: {
      color: '#98cd60'
    },
    titleText: {
      color: '#9d9d9d',
      fontSize: 24,
      flex: 3,
      height: 50
    },
    navBtn: {
      flex: 1,
    },
    navText: {
      color: '#9d9d9d',
      fontSize: 24,
      height: 50
    }
});

var CalendarTitle = React.createClass({
  onPressLeft: function(){
    var {
      year,
      month
    } = getDateDetail(this.props.date)
    month--;
    if(month === 0) {
      month = 12;
      year--;
    }
    this.props.onNavChange(new Date(year, month - 1));
  },
  onPressRight: function(){
    var {
      year,
      month
    } = getDateDetail(this.props.date)
    month++;
    if(month === 13) {
      month = 1;
      year++;
    }
    this.props.onNavChange(new Date(year, month - 1));
  },
  render: function() {
    var {
      year,
      month
    } = getDateDetail(this.props.date)
    return (
      <View style={styles.title}>
        <TouchableHighlight style={styles.navBtn} underlayColor={"#98cd60"} onPress={this.onPressLeft}>
          <Text style={[styles.text, styles.navText]}>{'<'}</Text>
        </TouchableHighlight>
        <Text style={[styles.text, styles.titleText]}>{year}年{month}月</Text>
        <TouchableHighlight style={styles.navBtn} underlayColor={"#98cd60"} onPress={this.onPressRight}>
          <Text style={[styles.text, styles.navText]}>{'>'}</Text>
        </TouchableHighlight>
      </View>
    );
  }
});


var CalendarHeader = React.createClass({
  
  render: function() {
    var nodes = ['日', '一', '二', '三', '四','五', '六'].map(function(text){
      return (
        <View style={styles.day}>
          <Text style={[styles.text, styles.headText]}>{text}</Text>
        </View>
      );
    });
    return (
      <View style={styles.row}>
        {nodes}        
      </View>
    );  
  }
});

var CalendarBody = React.createClass({
  getFirstDay: function(year, month) {
    var firstDay = new Date(year, month - 1, 1);
    return firstDay.getDay(); 
  },
  getMonthLen: function(year, month) {
    var nextMonth = new Date(year, month, 1);
    nextMonth.setHours(nextMonth.getHours() - 3);
    return nextMonth.getDate();
  },
  getCalendarTable: function(year, month) {
    var monthLen = this.getMonthLen(year, month);
    var firstDay = this.getFirstDay(year, month);
    var list = [
      []
    ];
    var i, cur, row, col;
    for (i = firstDay; i--;) {
      list[0].push('');
    }
    for (i = 1; i <= monthLen; i++) { //循环写入每天的值进入TABLE中
      cur = i + firstDay - 1;
      row = Math.floor(cur / 7);
      col = cur % 7;
      list[row] = list[row] || [];
      list[row].push(i);
    }
    var lastRow = list[row];
    var remain = 7 - list[row].length;
    for(i = 7 - lastRow.length;i--;) {
      lastRow.push('');
    }
    return list;
  },
  onPressDay: function(year, month, day){
    this.props.onSelectedChange(new Date(year, month - 1, day));
  },
  render: function() {
    var that = this;
    var {
      year,
      month
    } = getDateDetail(this.props.date);
    var o = getDateDetail(this.props.current);
    var curYear = o.year;
    var curMonth = o.month;
    var curDay = o.day;
    var table = this.getCalendarTable(year, month);
    var nodes = table.map(function(row){
      var days = row.map(function(day){
        var isCur = (year === curYear) && (month === curMonth) && (day === curDay);
        if(isCur) {
          return (
            <View style={styles.day}>
              <Text style={[styles.text, styles.curDayText]}>{day}</Text>            
            </View>
          );
        } else {
          var pressCb = function(){
            that.onPressDay(year, month, day);
          }
          return (
            <View style={styles.day}>
              <TouchableHighlight style={styles.day} underlayColor={"#98cd60"} onPress={pressCb}>
                <Text style={[styles.text, styles.dayText]}>{day}</Text>
              </TouchableHighlight>
            </View>
          );
        }
        
      });
      return (
        <View style={styles.row}>
          {days}
        </View>
      );
    });
    return (
      <View style={styles.day}>
        {nodes}
      </View>
    );
  }
});

var CalendarApp = React.createClass({
  getInitialState: function(){
    var cur = new Date();
    return {
      date: cur,
      current: cur
    };
  },
  onNavChange: function(date) {
    this.setState({
      date: date
    });
  },
  onSelectedChange: function(date) {
    this.setState({
      current: date
    });
  },
  render: function() {
    var date = this.state.date;
    var current = this.state.current;
    return (
      <View>
        <View style={styles.calendar}>
          <CalendarTitle date={date} onNavChange={this.onNavChange}/>
          <CalendarHeader/>
          <CalendarBody current={current} date={date} onSelectedChange={this.onSelectedChange}/>
        </View>
      </View>
    );
  }
});

React.AppRegistry.registerComponent('CalendarApp', function() {
    return CalendarApp;
});


