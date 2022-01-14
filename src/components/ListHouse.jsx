import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { GrAdd } from 'react-icons/gr';
import call_api from '../services/request';
import {useHistory} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  div: {
    paddingTop: '5%',
    margin: 'auto',
    width: '40%',
    height: '80%',
  },
}));

export default function ListHouse() {
  let history = useHistory()
  const classes = useStyles();

  const [houses, setHouses] = useState([])

  const emptyHouse = [{
    id: 0,
    name: "Bạn chưa có nhà nào",
  }]

  useEffect(() => {
    async function getHouses() {
      const res = await call_api({
        method: 'GET',
        url: '/houses'
      });
      const houses = res.data;
      setHouses(houses);
    }
    getHouses()
  }, [])

  function addHomeHandlerOnlick() {
    history.push('/add-house')
  }

  function detailHouse() {
    history.push('/house')
  }

  function genHouses() {
    let housesNow = houses
    let haveHouse = true
    if(houses.length == 0){
      haveHouse = false
      housesNow = emptyHouse
    } 
    return housesNow.map((house, index) =>
      <ListItem 
        key={index} 
        className="house-item" 
        style={{ width: '90%' }} 
        onClick={haveHouse ? detailHouse : () => {}}
      >
        <ListItemText primary={house.name} />
      </ListItem>
    )
  }

  return (
    <div className={classes.div}>

      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader" className="list-sub-header">
            <span className='header-house ml-5'>
              Danh sách nhà của bạn
            </span>
            <GrAdd
              className='header-add mt-3 mb-3 mr-5'
              onClick={addHomeHandlerOnlick}
            />
          </ListSubheader>
        }
        className={classes.root}
      >
        {genHouses()}
        {/* <ListItem className="house-item" style={{ width: '90%' }}>
          <ListItemText primary="Photos" secondary="Jan 9, 2014" />
        </ListItem> */}
      </List>
    </div>
  );
}
