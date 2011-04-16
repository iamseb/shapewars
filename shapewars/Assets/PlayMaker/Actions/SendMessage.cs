// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.ScriptControl)]
	[Tooltip("Sends a Message to a Game Object. See Unity SendMessage docs.")]
	public class SendMessage : FsmStateAction
	{
		public enum MessageType
		{
			SendMessage,
			SendMessageUpwards,
			BroadcastMessage
		}

		[RequiredField]
		public FsmOwnerDefault gameObject;
		public MessageType delivery;
		public SendMessageOptions options;
		[RequiredField]
		public FunctionCall functionCall;

		public override void Reset()
		{
			gameObject = null;
			delivery = MessageType.SendMessage;
			options = SendMessageOptions.DontRequireReceiver;
			functionCall = null;
		}

		public override void OnEnter()
		{
			if (gameObject.OwnerOption == OwnerDefaultOption.UseOwner)
				DoSendMessage(Owner);
			else
				DoSendMessage(gameObject.GameObject.Value);
			
			Finish();
		}

		void DoSendMessage(GameObject go)
		{
			switch (delivery)
			{
				case MessageType.SendMessage:

					switch (functionCall.ParameterType)
					{
						case "None":
							go.SendMessage(functionCall.FunctionName, options);
							return;

						case "int":
							go.SendMessage(functionCall.FunctionName, functionCall.IntParameter.Value, options);
							return;

						case "float":
							go.SendMessage(functionCall.FunctionName, functionCall.FloatParameter.Value, options);
							return;

						case "string":
							go.SendMessage(functionCall.FunctionName, functionCall.StringParameter.Value, options);
							return;

						case "GameObject":
							go.SendMessage(functionCall.FunctionName, functionCall.GameObjectParameter.Value, options);
							return;
					
						case "Object":
							go.SendMessage(functionCall.FunctionName, functionCall.ObjectReferenceParameter, options);
							return;
					}
					return;

				case MessageType.SendMessageUpwards:

					switch (functionCall.ParameterType)
					{
						case "None":
							go.SendMessageUpwards(functionCall.FunctionName, options);
							return;

						case "int":
							go.SendMessageUpwards(functionCall.FunctionName, functionCall.IntParameter.Value, options);
							return;

						case "float":
							go.SendMessageUpwards(functionCall.FunctionName, functionCall.FloatParameter.Value, options);
							return;

						case "string":
							go.SendMessageUpwards(functionCall.FunctionName, functionCall.StringParameter.Value, options);
							return;

						case "GameObject":
							go.SendMessage(functionCall.FunctionName, functionCall.GameObjectParameter.Value, options);
							return;
					
						case "Object":
							go.SendMessageUpwards(functionCall.FunctionName, functionCall.ObjectReferenceParameter, options);
							return;
					}
					return;

				case MessageType.BroadcastMessage:

					switch (functionCall.ParameterType)
					{
						case "None":
							go.BroadcastMessage(functionCall.FunctionName, options);
							return;

						case "int":
							go.BroadcastMessage(functionCall.FunctionName, functionCall.IntParameter.Value, options);
							return;

						case "float":
							go.BroadcastMessage(functionCall.FunctionName, functionCall.FloatParameter.Value, options);
							return;

						case "string":
							go.BroadcastMessage(functionCall.FunctionName, functionCall.StringParameter.Value, options);
							return;

						case "GameObject":
							go.SendMessage(functionCall.FunctionName, functionCall.GameObjectParameter.Value, options);
							return;
					
						case "Object":
							go.BroadcastMessage(functionCall.FunctionName, functionCall.ObjectReferenceParameter, options);
							return;
					}
					return;
			}
		}
	}
}