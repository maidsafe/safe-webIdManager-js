import React from 'react';
import { Upload, message } from 'antd';

function getBase64( img, callback )
{
    const reader = new FileReader();
    reader.addEventListener( 'load', () => callback( reader.result ) );
    reader.readAsDataURL( img );
}

function getBinary( img, callback )
{
    const reader = new FileReader();
    reader.addEventListener( 'load', () => callback( reader.result ) );
    reader.readAsArrayBuffer( img );
}

function beforeUpload( file )
{
    const isJPG = file.type === 'image/jpeg';
    if ( !isJPG )
    {
        message.error( 'You can only upload JPG file!' );
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if ( !isLt2M )
    {
        message.error( 'Image must smaller than 2MB!' );
    }

    // we dont want to attempt to trigger an upload.
    // there is no server! so should return false if not for updating FORM issue (doesnt happen if no upload,
    // so looking at a potential dummy server in browser)
    return isJPG && isLt2M;
}

class Avatar extends React.Component
{
  state = {
      loading : false,
  };

  handleChange = ( info, fileList, event ) =>
  {
      console.log( 'handling file change, ', info );
      // if ( info.file.status === 'uploading' )
      // {
      //     this.setState( { loading: true } );
      //     return;
      // }
      // if ( info.file.status === 'done' )
      // {
      // Get this url from response in real world.

      // var event = new Event('input', { bubbles: true });
      const uploader = this.uploader;

      getBase64( info.file.originFileObj, imageUrl =>
      {
          this.setState( { imageUrl } );
      } );

      getBinary( info.file.originFileObj, imageBinary =>
      {
          this.setState( { imageBinary, imageMimeType: info.file.type } );
      } );
  }
  render()
  {
      const { value } = this.props;
      const uploadButton = (
          <div>
              { this.state.loading ? 'loading' : '' }
              <div className="ant-upload-text">Upload</div>
          </div>
      );

      const imageUrl = this.state.imageUrl || value;
      return (
          <Upload
              ref={ ( c ) =>
              {
                  this.uploader = c;
              } }
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={ false }
              ref={(c)=> {this.uploader = c}}
              beforeUpload={ beforeUpload }
              onChange={ this.handleChange }
          >
              {imageUrl ? <img src={ imageUrl } alt="avatar" /> : uploadButton}
          </Upload>
      );
  }
}

export default Avatar;
