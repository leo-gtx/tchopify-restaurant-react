import React from 'react';
import { withSnackbar } from 'notistack5';
import Page500 from '../pages/Page500';
import NetworkError from '../pages/NetworkError';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }


    componentDidMount(){
      window.addEventListener('online', ()=>{
      //  this.setState({ isOnline: true});
      this.props.enqueueSnackbar('You are online!', { variant: 'success'});
    });
    window.addEventListener('offline', ()=>{
      // this.setState({ isOnline: false});
      this.props.enqueueSnackbar('You are offline!', { variant: 'error'});
    })
  }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

  
    componentDidCatch(error, errorInfo) {
      // log the error to an error reporting service
      console.log({ error, errorInfo });
    }

   

    componentWillUnmount(){
        window.removeEventListener('online',  ()=>{
          // this.setState({ isOnline: true});
          this.props.enqueueSnackbar('You are online!', { variant: 'success'});
      });
      window.removeEventListener('offline',  ()=>{
        // this.setState({ isOnline: false});
        this.props.enqueueSnackbar('You are offline!', { variant: 'error'});
    })
  }
  
  
  
    render() {
      if (this.state.hasError) {
        return <Page500/>;
      }
      return this.props.children; 
    }
  }

  export default  withSnackbar(ErrorBoundary);