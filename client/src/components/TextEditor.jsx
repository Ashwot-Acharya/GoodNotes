import React, { useCallback, useRef , useEffect, useState} from 'react'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { io } from 'socket.io-client'




export default function TextEditor() {
  const [socket , setsocket] = useState();
  const [quill, setQuill] = useState()

  useEffect(()=>{
    const s = io("http://localhost:3001/")
    setsocket(s)


    return () =>{
      s.disconnect()
    }
  },[]);

useEffect(()=>{
  if (socket == null  || quill == null) return
  const handeler = (delta, olddelta, source)=>{
    if (source !== 'user') return
    socket.emit('send-changes',delta)
   }
 quill.on('text-change', handeler)
return ()=>{
  quill.off('text-change', handeler)
}
 
}, [socket , quill])

useEffect(()=>{
  if (socket == null  || quill == null) return
  const handeler = (delta)=>{
    quill.updateContents(delta)

   }
 socket.on('recieve-changes', handeler)
return ()=>{
  socket.off('recieve-changes', handeler)
}
 
}, [socket , quill])





   const WrapperRef= useCallback((wrapper)=>{
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        
      ['image','blockquote', 'code-block'],
    
      [{ 'header': 1 }, { 'header': 2 }],               
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      
      [{ 'indent': '-1'}, { 'indent': '+1' }],          
      [{ 'direction': 'rtl' }],                        
    
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          
      [{ 'font': [] }],
      [{ 'align': [] }],
    
      ['clean']                                         
    ];

    const mobile_toolbar = [
      ['bold', 'italic', 'underline'],
      [{'header':[1,2,3,4,5,6,false]}],
      [{ 'color': [] }, { 'background': [] }],          
      [{'align':[]}]
      
    ]

    const scwidth = screen.availWidth
    console.log(scwidth)

    if (scwidth > 690){
      if (wrapper == null) return

    wrapper.innerHTML = ''

    const editor = document.createElement('div')
    
    wrapper.append(editor)

    const q = new Quill(editor,{
      modules:{
        toolbar: toolbarOptions
      },
        theme: 'snow',
    })
    setQuill(q)


    }
    else{
      if (wrapper == null) return

      wrapper.innerHTML = ''
  
      const editor = document.createElement('div')
      
      wrapper.append(editor)
  
     const q =  new Quill(editor,{
        modules:{
          toolbar: mobile_toolbar
        },
          theme: 'snow',
      })
      setQuill(q)
    }




      
  
  },[])



  return (
    <div className='container' ref={WrapperRef}></div>
  )
}
