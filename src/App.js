import './App.css';
import Home from './pages/Home/Home';
import House from './pages/House/House';
import AddHouse from './pages/AddHouse/AddHouse';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { createContext, useContext } from 'react';
import auth from "./services/auth";
import { useDispatch, useSelector } from 'react-redux';
import Toast from './components/Toast'

const AuthContext = createContext();

function ProvideAuth({ children }) {
  const verify = useSelector(state => state.auth)
  return (
    <AuthContext.Provider value={verify}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const auth = useSelector(state => state.auth)
  return (
    <Route render={() => auth ? (children) : <Redirect to="/login" />} />
  );
}

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <Home />
          </PrivateRoute>
          <PrivateRoute exact path="/house">
            <House />
          </PrivateRoute>
          <PrivateRoute exact path="/add-house">
            <AddHouse />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
        </Switch>
          <Toast />
      </Router>
    </ProvideAuth>
  );
}

export default App;
