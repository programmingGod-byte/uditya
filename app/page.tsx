"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [speed, setSpeed] = useState("")
  const [angle, setAngle] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speed: Number.parseFloat(speed),
          angle: Number.parseFloat(angle),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Data submitted successfully!")
        setSpeed("")
        setAngle("")
      } else {
        setMessage(data.error || "Failed to submit data")
      }
    } catch (error) {
      setMessage("Error: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Speed & Angle Tracker</h1>
        <p className="text-gray-600 text-center mb-6">Submit your speed and angle data</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-2">
              Speed
            </label>
            <Input
              id="speed"
              type="number"
              placeholder="Enter speed (e.g., 50)"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              required
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="angle" className="block text-sm font-medium text-gray-700 mb-2">
              Angle
            </label>
            <Input
              id="angle"
              type="number"
              placeholder="Enter angle (e.g., 45)"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              required
              step="0.01"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-center font-medium ${
              message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </Card>
    </main>
  )
}
