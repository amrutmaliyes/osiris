import React, { useState } from 'react';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';

const App = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
      <div>
        {isLogin ? (
          <Login onSwitch={() => setIsLogin(false)} />
        ) : (
          <SignUp onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    );
};

export default App;
