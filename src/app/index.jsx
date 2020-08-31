import React, { useState, useCallback } from "react";
import { render } from "react-dom";
import { useDropzone } from 'react-dropzone';
import { Container, Segment, Dimmer, Loader, Header, Image, Message } from 'semantic-ui-react'
import axios from 'axios';

import 'semantic-ui-css/semantic.min.css'
import "./../scss/main.scss";
import logo from '../public/assets/osakalogo1200.png';

const App = () => {
  const [request, setRequest] = useState({
    loading: false,
    image: null,
    error: false,
  })

  const onDropAccepted = useCallback((acceptedFiles) => {
    // ファイルをPOST
    let params = new FormData();
    params.append('file', acceptedFiles[0]);

    setRequest({...request, loading: true, error: false})

    let instance = axios.create({
      'responseType': 'arraybuffer',
      'headers': {
        'Content-Type': 'image/jpeg'
      }
    });
    instance.post('/api/convert/', params)
      .then(function(response) {
        // 成功時
        console.log(response.data)
        var base64 = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        console.log(base64)
        setRequest({...request, loading: false, error: false, image: base64})
      })
      .catch(function(error) {
        console.log(error);
        setRequest({...request, loading: false, error: true, image: false})
      });
  })

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    multiple: false,
    accept: 'image/jpeg,image/png,image/jpg',
    onDropAccepted,
  });

  const renderDropzone = () => {
    return (
      <div className="drop" {...getRootProps()} >
        <input {...getInputProps() } />
        {
          isDragActive ?
            <p>ここに画像ファイルをドロップしてください</p> :
            <p>画像ファイルを選択、またはドロップしてください</p>
        }
      </div>
    )
  }

  const hexToBase64 = (str) => {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
  }

  const renderImage = () => {
    if (request.image) {
      return (
        <Image className='image' src={'data:image/jpeg;base64,' + request.image} />
      )
    }
    return (
      <>
        <p>引用元：<a href='https://www.expo2025.or.jp/'>公益社団法人2025年日本国際博覧会協会</a></p>
        <Image className='image' src={logo} />
      </>
    )
  }

  return (
    <Container className="container">
      <Header as='h1' block className="header">
        EXPOフォトフレーム
      </Header>
      <Segment>
        <Dimmer inverted active={request.loading}>
          <Loader>Loading</Loader>
        </Dimmer>
        <div className="home">
          { renderDropzone() }
        </div>
        { request.error && (
          <Message negative>
            <Message.Header>
              サーバでエラーが発生しました、時間をおいて再度お試しください。
            </Message.Header>
          </Message>
        )}
        <div className="image-wrapper">
          { renderImage() }
        </div>
      </Segment>
    </Container>
  );
}

render(<App />, document.getElementById("app"));
