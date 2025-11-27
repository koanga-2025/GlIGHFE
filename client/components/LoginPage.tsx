import { useAuth0 } from '@auth0/auth0-react'
import { createUser, getUserById } from '../apis/users'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated'
import { UserData } from '../../models/user'

function LoginPage() {
  const emptyFormState = {
    name: '',
    bio: '',
    font: '',
    profilePicture: '',
  } as UserData
  const queryClient = useQueryClient()
  const { loginWithRedirect, isAuthenticated, user } = useAuth0()
  const navigate = useNavigate()
  const [formState, setFormState] = useState<UserData>(emptyFormState)
  const authId = user?.sub ?? ''
  const createMutation = useMutation({
    mutationFn: (user: UserData) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', authId] })
    },
  })

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', authId],
    queryFn: () => getUserById(authId),
    enabled: isAuthenticated && !!authId,
  })

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      authId,
    }))
  }, [authId])

  useEffect(() => {
    if (isAuthenticated && userData) {
      navigate('/feed')
    }
  }, [userData, isAuthenticated, navigate])

  const handleLogin = async () => {
    const redirectUri = `${window.location.origin}`
    await loginWithRedirect({
      authorizationParams: { redirect_uri: redirectUri, prompt: 'login' },
    })
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    try {
      await createMutation.mutateAsync(formState)
      navigate('/onboarding')
    } catch (error) {
      console.error('Failed to Update Profile:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading user data</div>
  }

  return (
    <div className="flex flex-col items-center">
      <IfNotAuthenticated>
        <h1>GlIGHFE</h1>
        <button onClick={handleLogin}>
          <img src="../../images/loginButton96.png" alt="Login Logo" />
        </button>
      </IfNotAuthenticated>
      <IfAuthenticated>
        <p className='mt-5'>Create Account</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="Name"
              className="text-heading mb-2.5 mt-4 block text-sm font-medium"
            >
              Name:
              <input
                type="text"
                id="name"
                name="name"
                placeholder="User Name"
                className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body block w-full rounded-lg border border-black px-3 py-2.5 text-sm"
                value={formState.name}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="Bio"
              className="text-heading mb-2.5 block text-sm font-medium"
            >
              Bio:
              <input
                name="bio"
                type="text"
                id="bio"
                placeholder="Bio"
                className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body block w-full rounded-lg border border-black px-3 py-2.5 text-sm"
                value={formState.bio}
                onChange={handleChange}
              ></input>
            </label>
            {/* Also profile picture */}
          </div>
          <button type="button" className="bg-lime-300 ml-7 box-border border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none">Create Profile</button>
        </form>
      </IfAuthenticated>
      <IfNotAuthenticated>
        <p>Please log in create a profile and explore!</p>
      </IfNotAuthenticated>
    </div>
  )
}

export default LoginPage

// <div>
//         <label for="visitors" class="block mb-2.5 text-sm font-medium text-heading">Base Input</label>
//         <input type="text" id="visitors" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="" required />
//     </div>
