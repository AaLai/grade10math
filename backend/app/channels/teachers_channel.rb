class TeachersChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "teachers_channel"
  end

  # takes in the info from REACT and then broadcasts it to the scoreboard

  # INBound messages from Teachers
  def start_test (data)
    # called when teacher clicks START on front end
    @student = Student.find(data["id"])
    first_question = Question.where(category: 1).where(level: 2).where(round: 1)
    # StudentsChannel.broadcast_to @student, first_question
    StudentsChannel.broadcast_to @student, first_question
  end

  def send_message (data)
    # called when teacher clicks message to student
    @student = Student.find(data["id"])
    StudentsChannel.broadcast_to @student, [data["message"]]
  end

  def end_test (data)
    @student = Student.find(data["id"])
    StudentsChannel.broadcast_to @student, [ "game", "over" ]
  end

  def pause_test (data)
    @student = Student.find(data["id"])
    StudentsChannel.broadcast_to @student, [data["pause"], "extra", "data"]
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
