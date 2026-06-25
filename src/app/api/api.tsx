import { register } from "module";


const API_URL = process.env.NEXT_PUBLIC_API_URL;



export async function Register(Username:string,Email:string,Password:string){
    const res = await fetch(`${API_URL}/api/auth/Register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username:Username, email:Email, password:Password }),
  });

   if (!res.ok) {
    throw new Error("Login failed");
  }
  else{
    await login(Email,Password);

  }
  const data = await res.json();


  return data;
}
export async function login(email: string, password: string) {
    
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }
  const data = await res.json();

localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data));
  return data;
}
export async function ForgotPassword(Email:string){
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/Auth/forgot-password`,{
      method:"POST",
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        email:Email
      })
  });
  
  return res.json();
}
export async function ResetPassword(email_param:string,password_param:string,code_param:string){
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/Auth/reset-password`,{
      method:"POST",
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        email:email_param,
        code:code_param,
        newPassword:password_param
      })
  });
  
  return res.json();
}
export async function getTasks(groupId:number | null) {

const token =localStorage.getItem("token");
 let url = `${API_URL}/api/tasks`;

  if (groupId != null) {
    url += `?groupId=${groupId}`;
  }
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");

  return res.json();
}



export async function createTask(
  name: string,
  description: string,
  date:string,
  category:number | null,
  user:number,
  idTag:number |null,
  idGroup:number |null
) {
const token =localStorage.getItem("token");
  
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name:name,
      content:description,
      date:date,
      category_id:category,
      user_id:user,
      group_id:idGroup
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  if (idTag != null) {
    await CreateTagTaskConnection(data.data.id, idTag);
  }

  return data;
}
async function findTask(id:number) {

  const token =localStorage.getItem("token");
   const res = await fetch(`${API_URL}/api/tasks/${id}`,{
    method:"GET",
    headers:{
      "Content-type":"application/json",
      Authorization:`Bearer ${token}`
    },
    
   })
  
   return res.json()
}
export async function deleteTask(
  id:number
)
{
  const task= await findTask(id);
 
 
  
  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/tasks/${id}`,{
      method:"PUT",
      headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${token} `
      },
     body:JSON.stringify({
      name:task.name,
      content:task.content,
      deleted:true,
      user_id:task.user_id,
      status:task.status,
      completed:task.completed
      
     })
    })
    const data = await res.json();
    

    return data

}

export async function updateTaskContent(
  id:number,
  content_param:string
)
{
  const task= await findTask(id);
 

  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/tasks/${id}`,{
      method:"PUT",
      headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${token} `
      },
     body:JSON.stringify({
      name:task.name,
      content:content_param,
      deleted:task.deleted,
      user_id:task.user_id,
      status:task.status,
      completed:task.completed
      
     })
    })
    const data = await res.json();
  

    return data

}
export async function updateStatus(
  id:number
)
{
  const task= await findTask(id);
  let res=null;

  
 const token =localStorage.getItem("token");
  if(task.completed){
     res = await fetch(`${API_URL}/api/tasks/${id}`,{
      method:"PUT",
      headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${token} `
      },
      
     body:JSON.stringify({
      name:task.name,
      content:task.content,
      deleted:task.deleted,
      user_id:task.user_id,
      status:task.status,
      completed:false
      
     })
    })
    }
    else{
      res = await fetch(`${API_URL}/api/tasks/${id}`,{
      method:"PUT",
      headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${token} `
      },
      
     body:JSON.stringify({
      name:task.name,
      content:task.content,
      deleted:task.deleted,
      user_id:task.user_id,
      status:task.status,
      completed:true
      
     })
    })
    }
    const data = await res.json();
   

    return data

}

export async function deleteOneDeleted(id:number) {

 const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/tasks/${id}`,{
      method:"DELETE",
      headers:{
       
        Authorization:`Bearer ${token}`
      },
      
    });
     if (!res.ok) {
    throw new Error("Delete failed");
  }
    
    return await res.json();
}

export async function findCategorie(id:number) {
 
  const token =localStorage.getItem("token");
   const res = await fetch(`${API_URL}/api/Categories/${id}`,{
    method:"GET",
    headers:{
      "Content-type":"application/json",
      Authorization:`Bearer ${token}`
    },
    
   })
  
   return res.json()
}
export async function getCategories(groupId:number|null){
  const token =localStorage.getItem("token");
  const url =
    groupId != null
      ? `${API_URL}/api/categories?groupId=${groupId}`
      : `${API_URL}/api/categories`;
  const res = await fetch(`${url}`,{
    method:"GET",
    headers:{
      "Content-type":"Application/json",
      Authorization:`Bearer ${token}`
    }
  })
  const data = res.json();

  return data;

}
export async function postCategorie(name_param:string,user_id_param:number,workspace_id_param:number|null,sticker_id_param:number|null) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/categories`,{
    method:"POST",
    headers:{
      "Content-type":"Application/json",
      Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({
      name:name_param,
      user_id:user_id_param,
      workspace_id:workspace_id_param,
      sticker_id:sticker_id_param
    })
  })
  const data = res.json();
  console.log(data);
  return data;
}
export async function deleteCategorie(id:number) {

 const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Categories/${id}`,{
      method:"DELETE",
      headers:{
       
        Authorization:`Bearer ${token}`
      },
      
    });
     if (!res.ok) {
    throw new Error("Delete failed");
  }
    
    return await res.json();
}

export async function editCategorie(
  id_param:number,
  name_param:string,
  sticker_id_param:number,
)
{
  const categorie = await findCategorie(id_param);

  
  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Categories/${id_param}`,{
      method:"PUT",
      headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${token} `
      },
     body:JSON.stringify({
      name:name_param,
      sticker_id:sticker_id_param,
      user_id:categorie.user_id,
      workspace_id:categorie.workspace_id
      
     })
    })
    const data = await res.json();
   

    return data

}
export async function getStickers(){
  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/stickers`,{
      method:"GET",
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      
    });
    return res.json();
}

export async function getStickerById(id:number|undefined){

  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Stickers/${id}`,{
      method:"GET",
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
     
    });
    return await res.json();
}


export async function getTags(userId: number, groupId: number | null) {
  const token = localStorage.getItem("token");

  const url =
    groupId == null
      ? `${API_URL}/api/Tags/users/${userId}`
      : `${API_URL}/api/Tags/users/${userId}?groupId=${groupId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

export async function findTag(id:number) {
 
  const token =localStorage.getItem("token");
   const res = await fetch(`${API_URL}/api/Tags/${id}`,{
    method:"GET",
    headers:{
      "Content-type":"application/json",
      Authorization:`Bearer ${token}`
    },
    
   })
  
   return res.json()
}

export async function postTag(color_param:string,name_param:string,user_id_param:number,workspace_id_param:number|null,parent_id_param:number|null) {
 
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/Tags`,{
    method:"POST",
    headers:{
      "Content-type":"Application/json",
      Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({
      color:color_param,
      name:name_param,
      user_id:user_id_param,
      workspace_id:workspace_id_param,
      parent_id:parent_id_param
    })
  })
  const data = res.json();

  return data;
}

export async function deleteTag(id:number) {

 const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Tags/${id}`,{
      method:"DELETE",
      headers:{
       "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      
    });
    const data =res.json();
     if (!res.ok) {
    throw new Error("Delete failed");
  }
    
    return data;
}

export async function editTag(
  id_param:number,
  name_param:string,
  color_param:string,
  parent_id_param:number
)
{
  const Tag = await findTag(id_param);

  
  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Tags/${id_param}`,{
      method:"PUT",
      headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${token} `
      },
     body:JSON.stringify({
      name:name_param,
      color:color_param,
      parent_id:parent_id_param,
      user_id:Tag.user_id,
      workspace_id:Tag.workspace_id
      
     })
    })
    const data = await res.json();
   

    return data

}

export async function CreateTagTaskConnection(id_task_param:number,id_tag_param:number){
    const token = localStorage.getItem("token");
  
    const res = await fetch(`${API_URL}/api/TagTasks`,{
      method:"POST",
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        id_task:id_task_param,
        id_tag:id_tag_param
      })
    })
     if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
}

export async function deleteTagTaskConnection(id_tag_param:number,id_task_param:number) {

 const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/TagTasks/${id_tag_param}/${id_task_param}`,{
      method:"DELETE",
      headers:{
       "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      
    

      
    });
     if (!res.ok) {
    throw new Error("Delete failed");
  }
    
    return true;
}



export async function getAllGroups(){
  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Group`,{
      method:"GET",
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      
    });
    
    return res.json();
}

export async function getGroupById(id:number){
  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Group/${id}`,{
      method:"GET",
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      
    });
    
    return res.json();
}

export async function getUsers(){
  const token =localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Users`,{
      method:"GET",
      headers:{
        "Content-type":"Application/json",
        Authorization:`Bearer ${token}`
      },
      
    });
    
    return res.json();
}


export async function addUsersToGroup(groupId: number, userIds: number[]) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/UsersGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      groupId,
      userIds
    })
  });

  if (!res.ok) {
    throw new Error("Failed to add users to group");
  }

  return await res.json();
}


export async function createGroup(
  name: string,
  imagePath: string | null
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/Group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      image_path: imagePath,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create group");
  }

  return await res.json();
}

export async function deleteGroup(id: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/Group/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete group");
  }

  return await res.json();
}

export async function getUsersByGroup(groupId: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/api/UsersGroup/${groupId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return await res.json();
}

export async function deleteUsersFromGroup(
  groupId: number,
  userIds: number[]
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/UsersGroup`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      groupId,
      userIds,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to remove users from group");
  }

  return await res.json();
}