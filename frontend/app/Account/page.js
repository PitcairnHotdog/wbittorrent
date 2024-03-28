import FavHashTable from "../components/FavHashTable"
import UserInfoCard from "../components/UserInfoCard"
import userInfo from "../components/UserInfoCard"
import "./page.css"

const test=[
    {
        "_id": "656d018d6945ab09d069494b",
        "title": "test",
        "description": "this is just a test"
    },
    {
        "_id": "656d018d6945ab09d069494c",
        "title": "test2",
        "description": "this is just a test2"
    }
]

export default function Account() {
  return (
    <>Account
    <div className="userinfo">
      <FavHashTable 
        FileInfos={test}
      />
    </div>
    </>
  )
}
