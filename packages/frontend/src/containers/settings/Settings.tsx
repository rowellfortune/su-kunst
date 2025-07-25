import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
// import { useAppContext } from '@/lib/contextLib'
import { Label } from '@radix-ui/react-label';
import { Controller, useForm } from 'react-hook-form';

// function Settings() {
//     const { isAuthenticated, user } = useAppContext();
   
//     return isAuthenticated && user ? (
//       <div className="w-full overflow-y-hidden p-1">
//         <div>Welcome back, {user.username}!</div>
//         <div className="flex flex-1 flex-col">
//           <div className="flex-none">
//             {/* <h3 className="text-lg font-medium">Profile</h3> */}
//             {/* <p className="text-muted-foreground text-sm">This is how others will see you on the site.</p> */}
//           </div>
//         </div>
//         <div data-orientation="horizontal" className="bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4 flex-none"></div>
//         <div className="faded-bottom h-full w-full overflow-y-auto scroll-smooth pr-4 pb-12">
//           <div className="-mx-1 px-1.5 lg:max-w-xl">
//             {/* <form className="space-y-8">
//               <div data-slot="form-item" className="grid gap-2">
//                 <Label htmlFor="username" className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[error=true]:text-destructive">Username</Label>
//                 <Input onChange={() => {console.log('Rowell')}} value={user.username} defaultValue={user.username} />
//                 <p data-slot="form-description" id="«rnk»-form-item-description" className="text-muted-foreground text-sm">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p></div>
//                 <div data-slot="form-item" className="grid gap-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Select>
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Select a verified email to display" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="light">Light</SelectItem>
//                       <SelectItem value="dark">Dark</SelectItem>
//                       <SelectItem value="system">System</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p data-slot="form-description" id="«rnl»-form-item-description" className="text-muted-foreground text-sm">You can manage verified email addresses in your <a href="/">email settings</a>.</p></div><div data-slot="form-item" className="grid gap-2">
//                   <Label htmlFor="bio"  className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[error=true]:text-destructive">Bio</Label>
//                   <Textarea onChange={() => {console.log('This is about me')}} placeholder="Tell us a little bit about yourself" name="bio"  value={''}/>
//                   <p data-slot="form-description" id="«rnn»-form-item-description" className="text-muted-foreground text-sm">You can <span>@mention</span> other users and organizations to link to them.</p>
//                 </div>
//               <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([className*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[&gt;svg]:px-3" type="submit">Update profile</button>
//             </form> */}
//           </div>
//         </div>
//       </div>
//     ) : (
//       <div>Please sign in</div>
//     );
// }

export default function Settings() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "Alex Rivera",
      username: "alexrivera",
      bio: "Digital artist & illustrator passionate about surreal landscapes and character design. Always exploring new techniques!",
      location: "San Francisco, CA",
      website: "alexrivera.art",
      theme: "dark-purple",
      notifications: {
        likes: true,
        comments: true,
        followers: true,
        messages: true,
      },
    },
  });

  const onSubmit = (data: any) => {
    console.log("Settings saved:", data);
    // TODO: call API to persist settings
  };

  return (
    <div className="p-6 flex-1 space-y-6 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800">
      <div>
        <h1 className="text-3xl font-bold text-indigo-400">Settings</h1>
        <p className="text-indigo-200">Manage your account settings and preferences.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Information */}
        <Card className="bg-gradient-to-r from-purple-800 to-purple-700 border-transparent">
          <CardHeader>
            <CardTitle className="text-purple-200">Profile Information</CardTitle>
            <CardDescription className="text-purple-300">
              Update your public profile details.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-indigo-200">Name</Label>
              <Input
                id="name"
                className="ring-1 ring-purple-500 focus:ring-2 focus:ring-indigo-400"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-sm text-red-400">Name is required.</p>
              )}
            </div>
            <div>
              <Label htmlFor="username" className="text-indigo-200">Username</Label>
              <Input
                id="username"
                className="ring-1 ring-purple-500 focus:ring-2 focus:ring-indigo-400"
                {...register("username", { required: true })}
              />
              {errors.username && (
                <p className="text-sm text-red-400">Username is required.</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="bio" className="text-indigo-200">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                className="bg-purple-900 ring-1 ring-purple-500 focus:ring-2 focus:ring-indigo-400"
                {...register("bio")}
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-indigo-200">Location</Label>
              <Input
                id="location"
                className="ring-1 ring-purple-500 focus:ring-2 focus:ring-indigo-400"
                {...register("location")}
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-indigo-200">Website</Label>
              <Input
                id="website"
                className="ring-1 ring-purple-500 focus:ring-2 focus:ring-indigo-400"
                {...register("website")}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Appearance */}
        <Card className="bg-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-200">Appearance</CardTitle>
            <CardDescription className="text-purple-300">
              Customize the look and feel of ArtistHub.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="theme" className="text-indigo-200">Theme</Label>
            <Controller
              name="theme"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  // className="ring-1 ring-purple-500"
                >
                  <SelectTrigger id="theme" className="w-48">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark-purple">
                      Dark Purple (Default)
                    </SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="solarized">Solarized</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-200">Notifications</CardTitle>
            <CardDescription className="text-purple-300">
              Manage how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Likes", name: "notifications.likes" },
              { label: "Comments", name: "notifications.comments" },
              { label: "New Followers", name: "notifications.followers" },
              { label: "Direct Messages", name: "notifications.messages" },
            ].map(({ label, name }) => (
              <div
                key={name}
                className="flex items-center justify-between"
              >
                <span className="text-indigo-200">{label}</span>
                {/* <Controller
                  // name={name}
                  // control={control}
                  render={({ field }) => (
                    <Switch
                      className="bg-indigo-500"
                      // checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                /> */}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="bg-gradient-to-r from-red-700 to-red-600">
          <CardHeader>
            <CardTitle className="text-red-100">Account</CardTitle>
            <CardDescription className="text-red-200">
              Manage your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-100">
              Permanently delete your account and all of your content. This action is irreversible.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
              Delete Account
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}


// export default Settings;