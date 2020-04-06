package com.jd565

import kotlinx.serialization.*
import kotlinx.serialization.json.*
import io.ktor.http.cio.websocket.DefaultWebSocketSession
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.readText
import io.ktor.routing.Route
import io.ktor.websocket.webSocket
import kotlinx.coroutines.channels.mapNotNull
import java.util.*

fun Route.ringingWebSocket() {
    val wsRoomConnections = Collections.synchronizedMap(
        HashMap<String, MutableList<DefaultWebSocketSession>>()
    )
    val json = Json.Default

    webSocket("/room/{id}") {
        val roomConnections = wsRoomConnections.getOrPut(call.parameters["id"]) {
            Collections.synchronizedList(ArrayList())
        }

        roomConnections += this
        val numConns = roomConnections.size
        roomConnections.forEachIndexed { index, ws ->
            val message = setBellsMessage(numConns * 2, index * 2 + 1, index * 2 + 2)
            ws.outgoing.send(Frame.Text(json.stringify(RingServerMessage.serializer(SetBellsMessage.serializer()), message)))
        }
        try {
            for (frame: Frame.Text in incoming.mapNotNull { it as? Frame.Text }) {
                val text = frame.readText()
                for (conn in roomConnections) {
                    if (conn !== this) {
                        conn.outgoing.send(Frame.Text(text))
                    }
                }
            }
        } finally {
            roomConnections -= this
            if (roomConnections.isEmpty()) {
                wsRoomConnections.remove(call.parameters["id"])
            }
        }
    }
}

@Serializable
private data class RingServerMessage<T>(
    val type: String,
    val data: T
)

private fun setBellsMessage(numBells: Int, bellOne: Int, bellTwo: Int): RingServerMessage<SetBellsMessage> =
    RingServerMessage(
        "SetBellsMessage",
        SetBellsMessage(numBells, bellOne, bellTwo)
    )

@Serializable
private data class SetBellsMessage(
    val numBells: Int,
    val bellOne: Int,
    val bellTwo: Int
)