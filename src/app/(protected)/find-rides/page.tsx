import { FindRidesView } from "./FindRidesView"

export default function FindRidesPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Find Rides</h1>
        <p className="text-muted-foreground mt-2">
          Browse available ride requests and accept the ones that work for you.
        </p>
      </div>
      <FindRidesView />
    </div>
  )
}
