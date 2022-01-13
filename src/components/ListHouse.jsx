import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { GrAdd } from 'react-icons/gr';
import call_api from '../services/request';

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
  const classes = useStyles();

  const [houses, setHouses] = useState([
    {
      id: 1,
      name: 'House1',
    },
    {
      id: 2,
      name: 'House2',
    },
    {
      id: 3,
      name: 'House3',
    },
    {
      id: 4,
      name: 'House4',
    },
  ])

  useEffect(() => {
    async function getHouses() {
      const res = await call_api({
        method: 'GET',
        url: '/houses'
      });
      const houses = res.data.data;
      setHouses(houses);
    }
    getHouses()
  }, [])

  function addHomeHandlerOnlick() {
    window.location = '/add-house'
  }

  function detailHouse() {
    window.location = '/house'
  }

  function genHouses() {
    return houses.map((house, index) =>
      <ListItem key={index} className="house-item" style={{ width: '90%' }} onClick={detailHouse}>
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
